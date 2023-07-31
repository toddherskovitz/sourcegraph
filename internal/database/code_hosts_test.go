package database

import (
	"context"
	"errors"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/sourcegraph/log/logtest"
	"github.com/sourcegraph/sourcegraph/internal/conf"
	"github.com/sourcegraph/sourcegraph/internal/database/dbtest"
	et "github.com/sourcegraph/sourcegraph/internal/encryption/testing"
	"github.com/sourcegraph/sourcegraph/internal/extsvc"
	"github.com/sourcegraph/sourcegraph/internal/types"
)

func TestCodeHostStore_CRUDCodeHost(t *testing.T) {
	if testing.Short() {
		t.Skip()
	}
	logger := logtest.Scoped(t)
	db := NewDB(logger, dbtest.NewDB(logger, t))
	ctx := context.Background()
	ten := int32(10)
	twenty := int32(20)
	confGet := func() *conf.Unified { return &conf.Unified{} }
	codeHost := &types.CodeHost{
		Kind:                        extsvc.KindGitHub,
		URL:                         "https://github.com/",
		APIRateLimitQuota:           &ten,
		APIRateLimitIntervalSeconds: &ten,
		GitRateLimitQuota:           &ten,
		GitRateLimitIntervalSeconds: &ten,
	}
	updatedCodeHost := &types.CodeHost{
		Kind:                        extsvc.KindGitHub,
		URL:                         "https://github.com/",
		APIRateLimitQuota:           &twenty,
		APIRateLimitIntervalSeconds: &twenty,
		GitRateLimitQuota:           &twenty,
		GitRateLimitIntervalSeconds: &twenty,
	}

	extsvcConfig := extsvc.NewUnencryptedConfig(`{"url": "https://github.com/", "repositoryQuery": ["none"], "token": "abc"}`)
	err := db.CodeHosts().Create(ctx, codeHost)
	if err != nil {
		t.Fatal(err)
	}

	// Create the external service so that the code host appears when we GetByID after.
	err = db.ExternalServices().Create(ctx, confGet, &types.ExternalService{
		CodeHostID: &codeHost.ID,
		Kind:       codeHost.Kind,
		Config:     extsvcConfig,
	})
	if err != nil {
		t.Fatal(err)
	}

	// Should get back the same one by id
	got, err := db.CodeHosts().GetByID(ctx, codeHost.ID)
	if err != nil {
		t.Fatal(err)
	}

	if diff := cmp.Diff(codeHost, got, et.CompareEncryptable); diff != "" {
		t.Fatalf("Mismatch (-want +got):\n%s", diff)
	}

	// Should get back the same one by url
	got, err = db.CodeHosts().GetByURL(ctx, codeHost.URL)
	if err != nil {
		t.Fatal(err)
	}

	if diff := cmp.Diff(codeHost, got, et.CompareEncryptable); diff != "" {
		t.Fatalf("Mismatch (-want +got):\n%s", diff)
	}

	// update the code host
	updatedCodeHost.ID = codeHost.ID
	err = db.CodeHosts().Update(ctx, updatedCodeHost)
	if err != nil {
		t.Fatal(err)
	}

	// Should get back the same one by url
	got, err = db.CodeHosts().GetByID(ctx, codeHost.ID)
	if err != nil {
		t.Fatal(err)
	}

	if diff := cmp.Diff(updatedCodeHost, got, et.CompareEncryptable); diff != "" {
		t.Fatalf("Mismatch (-want +got):\n%s", diff)
	}

	err = db.CodeHosts().Delete(ctx, codeHost.ID)
	if err != nil {
		t.Fatal(err)
	}

	// Now, it shouldn't exit
	_, err = db.CodeHosts().GetByID(ctx, codeHost.ID)
	var expected errCodeHostNotFound
	if !errors.As(err, &expected) {
		t.Fatal(err)
	}
}

func TestCodeHostStore_List(t *testing.T) {
	if testing.Short() {
		t.Skip()
	}
	logger := logtest.Scoped(t)
	db := NewDB(logger, dbtest.NewDB(logger, t))
	ctx := context.Background()
	ten := int32(10)
	twenty := int32(20)
	confGet := func() *conf.Unified { return &conf.Unified{} }
	codeHostOne := &types.CodeHost{
		Kind:                        extsvc.KindGitHub,
		URL:                         "https://github.com/",
		APIRateLimitQuota:           &ten,
		APIRateLimitIntervalSeconds: &ten,
		GitRateLimitQuota:           &ten,
		GitRateLimitIntervalSeconds: &ten,
	}
	codeHostTwo := &types.CodeHost{
		Kind:                        extsvc.KindGitLab,
		URL:                         "https://gitlab.com/",
		APIRateLimitQuota:           &twenty,
		APIRateLimitIntervalSeconds: &twenty,
		GitRateLimitQuota:           &twenty,
		GitRateLimitIntervalSeconds: &twenty,
	}

	extsvcConfig := extsvc.NewUnencryptedConfig(`{"url": "https://github.com/", "repositoryQuery": ["none"], "token": "abc"}`)
	err := db.CodeHosts().Create(ctx, codeHostOne)
	if err != nil {
		t.Fatal(err)
	}
	err = db.CodeHosts().Create(ctx, codeHostTwo)
	if err != nil {
		t.Fatal(err)
	}

	// Create the external service so that the first code host appears when we GetByID after.
	err = db.ExternalServices().Create(ctx, confGet, &types.ExternalService{
		CodeHostID: &codeHostOne.ID,
		Kind:       codeHostOne.Kind,
		Config:     extsvcConfig,
	})
	if err != nil {
		t.Fatal(err)
	}

	tests := []struct {
		name       string
		listOpts   ListCodeHostsOpts
		resultSize int
	}{
		{
			name: "get 1 by id",
			listOpts: ListCodeHostsOpts{
				ID: int32(1),
				LimitOffset: LimitOffset{
					Limit: 10,
				},
			},
			resultSize: 1,
		},
		{
			name: "get 1 by url",
			listOpts: ListCodeHostsOpts{
				URL: "https://github.com/",
				LimitOffset: LimitOffset{
					Limit: 10,
				},
			},
			resultSize: 1,
		},
		{
			name: "get all, non-deleted",
			listOpts: ListCodeHostsOpts{
				LimitOffset: LimitOffset{
					Limit: 10,
				},
			},
			resultSize: 1,
		},
		{
			name: "get all, with deleted",
			listOpts: ListCodeHostsOpts{
				IncludeDeleted: true,
				LimitOffset: LimitOffset{
					Limit: 10,
				},
			},
			resultSize: 2,
		},
		{
			name: "list with search",
			listOpts: ListCodeHostsOpts{
				IncludeDeleted: true,
				Search:         "gitlab",
				LimitOffset: LimitOffset{
					Limit: 10,
				},
			},
			resultSize: 1,
		},
		{
			name: "list with search matching none",
			listOpts: ListCodeHostsOpts{
				IncludeDeleted: true,
				Search:         "bitbucket",
				LimitOffset: LimitOffset{
					Limit: 10,
				},
			},
			resultSize: 0,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			// List by ID, must return 1
			ch, _, err := db.CodeHosts().List(ctx, test.listOpts)
			if err != nil {
				t.Fatal(err)
			}
			if len(ch) != test.resultSize {
				t.Fatalf("Expected %d code host, got %+v\n", test.resultSize, ch)
			}
		})
	}
}
