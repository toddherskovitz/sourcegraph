import { HTMLAttributes, ReactElement, MouseEvent } from 'react'

import { ParentSize } from '@visx/responsive'
import classNames from 'classnames'

import { ErrorAlert } from '@sourcegraph/branded/src/components/alerts'
import { SearchAggregationMode } from '@sourcegraph/shared/src/graphql-operations'
import { Text, Link, Tooltip } from '@sourcegraph/wildcard'

import { GetSearchAggregationResult, SearchAggregationDatum } from '../../graphql-operations'

import { AggregationChart } from './AggregationChart'

import styles from './AggregationChartCard.module.scss'

const getName = (datum: SearchAggregationDatum): string => datum.label ?? ''
const getValue = (datum: SearchAggregationDatum): number => datum.count
const getColor = (datum: SearchAggregationDatum): string => (datum.label ? 'var(--primary)' : 'var(--text-muted)')
const getLink = (datum: SearchAggregationDatum): string => datum.query ?? ''

/**
 * Nested aggregation results types from {@link AGGREGATION_SEARCH_QUERY} GQL query
 */
type SearchAggregationResult = GetSearchAggregationResult['searchQueryAggregate']['aggregations']

function getAggregationError(aggregation?: SearchAggregationResult): Error | undefined {
    if (aggregation?.__typename === 'SearchAggregationNotAvailable') {
        return new Error(aggregation.reason)
    }

    return
}

export function getAggregationData(aggregations: SearchAggregationResult): SearchAggregationDatum[] {
    switch (aggregations?.__typename) {
        case 'ExhaustiveSearchAggregationResult':
        case 'NonExhaustiveSearchAggregationResult':
            return aggregations.groups

        default:
            return []
    }
}

export function getOtherGroupCount(aggregations: SearchAggregationResult): number {
    switch (aggregations?.__typename) {
        case 'ExhaustiveSearchAggregationResult':
            return aggregations.otherGroupCount ?? 0
        case 'NonExhaustiveSearchAggregationResult':
            return aggregations.approximateOtherGroupCount ?? 0

        default:
            return 0
    }
}

interface AggregationChartCardProps extends HTMLAttributes<HTMLDivElement> {
    data?: SearchAggregationResult
    error?: Error
    loading: boolean
    mode?: SearchAggregationMode | null
    onBarLinkClick?: (query: string) => void
}

export function AggregationChartCard(props: AggregationChartCardProps): ReactElement | null {
    const { data, error, loading, mode, className, onBarLinkClick, 'aria-label': ariaLabel } = props

    if (error) {
        return (
            <div className={classNames(className, styles.errorContainer)}>
                <ErrorAlert className={styles.error} error={error} />
            </div>
        )
    }

    const aggregationError = getAggregationError(data)

    if (loading || aggregationError) {
        return (
            <div className={classNames(styles.container, className)}>
                <div className={styles.chartOverlay}>
                    {loading ? (
                        'Loading...'
                    ) : aggregationError ? (
                        <div>
                            We couldn’t provide aggregation for this query. {aggregationError?.message}.{' '}
                            <Link to="">Learn more</Link>
                        </div>
                    ) : null}
                </div>
            </div>
        )
    }

    if (!data) {
        return null
    }

    const missingCount = getOtherGroupCount(data)
    const handleDatumLinkClick = (event: MouseEvent, datum: SearchAggregationDatum): void => {
        event.preventDefault()
        onBarLinkClick?.(getLink(datum))
    }

    return (
        <ParentSize className={classNames(className, styles.container)}>
            {parent => (
                <>
                    <AggregationChart
                        aria-label={ariaLabel}
                        width={parent.width}
                        height={parent.height}
                        data={getAggregationData(data)}
                        mode={mode}
                        getDatumValue={getValue}
                        getDatumColor={getColor}
                        getDatumName={getName}
                        getDatumLink={getLink}
                        onDatumLinkClick={handleDatumLinkClick}
                    />

                    {!!missingCount && (
                        <Tooltip content={`Aggregation is not exhaustive, there are ${missingCount} groups more`}>
                            <Text size="small" className={styles.missingLabelCount}>
                                +{missingCount}
                            </Text>
                        </Tooltip>
                    )}
                </>
            )}
        </ParentSize>
    )
}
