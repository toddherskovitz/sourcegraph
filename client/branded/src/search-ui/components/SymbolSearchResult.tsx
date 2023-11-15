import React, { useCallback, type KeyboardEvent, type MouseEvent } from 'react'

import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import type { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import type { FetchFileParameters } from '@sourcegraph/shared/src/backend/file'
import { type HighlightLineRange, HighlightResponseFormat } from '@sourcegraph/shared/src/graphql-operations'
import { getFileMatchUrl, getRepositoryUrl, getRevision, type SymbolMatch } from '@sourcegraph/shared/src/search/stream'
import { isSettingsValid, type SettingsCascadeProps } from '@sourcegraph/shared/src/settings/settings'
import { SymbolKind } from '@sourcegraph/shared/src/symbols/SymbolKind'
import { TelemetryV2Props } from '@sourcegraph/shared/src/telemetry'
import type { TelemetryProps } from '@sourcegraph/shared/src/telemetry/telemetryService'
import { codeCopiedEvent } from '@sourcegraph/shared/src/tracking/event-log-creators'

import { CodeExcerpt } from './CodeExcerpt'
import { navigateToCodeExcerpt, navigateToFileOnMiddleMouseButtonClick } from './codeLinkNavigation'
import { CopyPathAction } from './CopyPathAction'
import { RepoFileLink } from './RepoFileLink'
import { ResultContainer } from './ResultContainer'

import searchResultStyles from './SearchResult.module.scss'
import styles from './SymbolSearchResult.module.scss'

export interface SymbolSearchResultProps extends TelemetryProps, TelemetryV2Props, SettingsCascadeProps {
    result: SymbolMatch
    openInNewTab?: boolean
    repoDisplayName: string
    containerClassName?: string
    index: number
    onSelect: () => void
    fetchHighlightedFileLineRanges: (parameters: FetchFileParameters, force?: boolean) => Observable<string[][]>
}

export const SymbolSearchResult: React.FunctionComponent<SymbolSearchResultProps> = ({
    result,
    openInNewTab,
    repoDisplayName,
    onSelect,
    containerClassName,
    index,
    telemetryService,
    telemetryRecorder,
    settingsCascade,
    fetchHighlightedFileLineRanges,
}) => {
    const enableLazyFileResultSyntaxHighlighting =
        isSettingsValid(settingsCascade) &&
        settingsCascade.final.experimentalFeatures?.enableLazyFileResultSyntaxHighlighting

    const repoAtRevisionURL = getRepositoryUrl(result.repository, result.branches)
    const revisionDisplayName = getRevision(result.branches, result.commit)

    const title = (
        <span className="d-flex align-items-center">
            <RepoFileLink
                repoName={result.repository}
                repoURL={repoAtRevisionURL}
                filePath={result.path}
                fileURL={getFileMatchUrl(result)}
                repoDisplayName={
                    repoDisplayName
                        ? `${repoDisplayName}${revisionDisplayName ? `@${revisionDisplayName}` : ''}`
                        : undefined
                }
                className={searchResultStyles.titleInner}
            />
            <CopyPathAction
                filePath={result.path}
                className={searchResultStyles.copyButton}
                telemetryService={telemetryService}
                telemetryRecorder={telemetryRecorder}
            />
        </span>
    )

    const navigate = useNavigate()
    const navigateToFile = useCallback(
        (event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>): void =>
            navigateToCodeExcerpt(event, openInNewTab ?? false, navigate),
        [openInNewTab, navigate]
    )

    const logEventOnCopy = useCallback(() => {
        telemetryService.log(...codeCopiedEvent('file-match'))
        telemetryRecorder.recordEvent('CodeCopiedEvent', 'copied', {
            privateMetadata: { ...codeCopiedEvent('file-match') },
        })
    }, [telemetryService, telemetryRecorder])

    const fetchSymbolMatchLineRanges = useCallback(
        (startLine: number, endLine: number, format: HighlightResponseFormat) => {
            const startTime = Date.now()
            return fetchHighlightedFileLineRanges({
                repoName: result.repository,
                commitID: result.commit || '',
                filePath: result.path,
                disableTimeout: false,
                format,
                ranges: result.symbols.map(
                    (symbol): HighlightLineRange => ({
                        startLine: symbol.line - 1,
                        endLine: symbol.line,
                    })
                ),
            }).pipe(
                map(lines => {
                    const endTime = Date.now()
                    telemetryService.log(
                        'search.latencies.frontend.code-load',
                        { durationMs: endTime - startTime },
                        { durationMs: endTime - startTime }
                    )
                    telemetryRecorder.recordEvent('search.latencies.frontend.code-load', 'loaded', {
                        privateMetadata: { durationMs: endTime - startTime },
                    })
                    return lines[
                        result.symbols.findIndex(symbol => symbol.line - 1 === startLine && symbol.line === endLine)
                    ]
                })
            )
        },
        [result, fetchHighlightedFileLineRanges, telemetryService, telemetryRecorder]
    )

    const fetchHighlightedSymbolMatchLineRanges = useCallback(
        (startLine: number, endLine: number) =>
            fetchSymbolMatchLineRanges(startLine, endLine, HighlightResponseFormat.HTML_HIGHLIGHT),
        [fetchSymbolMatchLineRanges]
    )

    const fetchPlainTextSymbolMatchLineRanges = useCallback(
        (startLine: number, endLine: number) =>
            fetchSymbolMatchLineRanges(startLine, endLine, HighlightResponseFormat.HTML_PLAINTEXT),
        [fetchSymbolMatchLineRanges]
    )

    return (
        <ResultContainer
            index={index}
            title={title}
            resultType={result.type}
            onResultClicked={onSelect}
            repoName={result.repository}
            repoStars={result.repoStars}
            className={classNames(searchResultStyles.copyButtonContainer, containerClassName)}
            resultClassName={styles.symbolsOverride}
            repoLastFetched={result.repoLastFetched}
        >
            <div className={styles.symbols}>
                {result.symbols.map(symbol => (
                    <div
                        key={`symbol:${symbol.name}${String(symbol.containerName)}${symbol.url}`}
                        className={styles.symbol}
                        data-href={symbol.url}
                        role="link"
                        data-testid="symbol-search-result"
                        tabIndex={0}
                        onClick={navigateToFile}
                        onMouseUp={navigateToFileOnMiddleMouseButtonClick}
                        onKeyDown={navigateToFile}
                        data-selectable-search-result="true"
                    >
                        <div className="mr-2 flex-shrink-0">
                            <SymbolKind
                                kind={symbol.kind}
                                symbolKindTags={
                                    isSettingsValid(settingsCascade) &&
                                    settingsCascade.final.experimentalFeatures?.symbolKindTags
                                }
                            />
                        </div>
                        <div className={styles.symbolCodeExcerpt}>
                            <CodeExcerpt
                                className="a11y-ignore"
                                repoName={result.repository}
                                commitID={result.commit || ''}
                                filePath={result.path}
                                startLine={symbol.line - 1}
                                endLine={symbol.line}
                                fetchHighlightedFileRangeLines={fetchHighlightedSymbolMatchLineRanges}
                                fetchPlainTextFileRangeLines={
                                    enableLazyFileResultSyntaxHighlighting
                                        ? fetchPlainTextSymbolMatchLineRanges
                                        : undefined
                                }
                                onCopy={logEventOnCopy}
                                highlightRanges={[]}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </ResultContainer>
    )
}
