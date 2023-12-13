package dbconn

import (
	"fmt"
	"go/types"
	"os"
	"slices"
	"strings"

	"golang.org/x/tools/go/analysis"

	"github.com/sourcegraph/sourcegraph/dev/linters/nolint"
)

var Analyzer = nolint.Wrap(&analysis.Analyzer{
	Name:     "dbconn",
	Doc:      "banana",
	Run:      run,
	Requires: []*analysis.Analyzer{},
})

var allowedToImport = []string{
	"github.com/sourcegraph/sourcegraph/cmd/embeddings",
	"github.com/sourcegraph/sourcegraph/cmd/frontend",
	"github.com/sourcegraph/sourcegraph/cmd/gitserver",
	"github.com/sourcegraph/sourcegraph/cmd/migrator",
	// Transitively depends on updatecheck package which imports but does not use DB
	"github.com/sourcegraph/sourcegraph/cmd/pings",
	"github.com/sourcegraph/sourcegraph/cmd/precise-code-intel-worker",
	"github.com/sourcegraph/sourcegraph/cmd/repo-updater",
	// Transitively depends on zoekt package which imports but does not use DB
	"github.com/sourcegraph/sourcegraph/cmd/searcher",
	// Doesn't connect but uses db internals for use with sqlite
	// Main entrypoint for running all services, so it must be allowed to import it.
	"github.com/sourcegraph/sourcegraph/cmd/sourcegraph",
	"github.com/sourcegraph/sourcegraph/cmd/symbols",
	"github.com/sourcegraph/sourcegraph/cmd/worker",
}

const dbconnPath = "github.com/sourcegraph/sourcegraph/internal/database/dbconn"

func run(pass *analysis.Pass) (interface{}, error) {
	f, err := os.Create("/tmp/bazel_log/" + strings.ReplaceAll(pass.Pkg.Path(), "/", "_") + ".txt")
	if err != nil {
		return nil, err
	}
	defer f.Close()

	if _, err := fmt.Fprintf(f, "THE PACKAGE %q %q\n", pass.Pkg.Path(), pass.Pkg.Name()); err != nil {
		return nil, err
	}

	// skip builds for packages outside
	if !strings.HasPrefix(pass.Pkg.Path(), "github.com/sourcegraph/sourcegraph") {
		return nil, nil
	}

	// these packages are allowed to import it
	if slices.Contains(allowedToImport, pass.Pkg.Path()) {
		return nil, nil
	}

	if dfs(pass.Pkg) {
		return nil, fmt.Errorf("package %q is not allowed to import %q (directly or transitively)", pass.Pkg.Path(), dbconnPath)
	}

	return nil, nil
}

var visited = make(map[string]struct{})

func dfs(pkg *types.Package) (found bool) {
	for _, pkg := range pkg.Imports() {
		if pkg.Path() == dbconnPath {
			return true
		}

		// skip imports leading outside
		if !strings.HasPrefix(pkg.Path(), "github.com/sourcegraph/sourcegraph") {
			continue
		}

		if _, ok := visited[pkg.Path()]; !ok {
			visited[pkg.Path()] = struct{}{}
			if dfs(pkg) {
				return true
			}
		}
	}
	return false
}
