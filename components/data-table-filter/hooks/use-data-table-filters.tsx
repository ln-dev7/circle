'use client'

import type React from 'react'
import { useMemo, useState } from 'react'
import { createColumns } from '../core/filters'
import { DEFAULT_OPERATORS, determineNewOperator } from '../core/operators'
import type {
  ColumnConfig,
  ColumnDataType,
  ColumnOption,
  DataTableFilterActions,
  FilterModel,
  FilterStrategy,
  FiltersState,
  NumberColumnIds,
  OptionBasedColumnDataType,
  OptionColumnIds,
} from '../core/types'
import { uniq } from '../lib/array'
import { addUniq, removeUniq } from '../lib/array'
import {
  createDateFilterValue,
  createNumberFilterValue,
  isColumnOptionArray,
  isColumnOptionMap,
  isMinMaxTuple,
} from '../lib/helpers'

export interface DataTableFiltersOptions<
  TData,
  TColumns extends ReadonlyArray<ColumnConfig<TData, any, any, any>>,
  TStrategy extends FilterStrategy,
> {
  strategy: TStrategy
  data: TData[]
  columnsConfig: TColumns
  defaultFilters?: FiltersState
  filters?: FiltersState
  onFiltersChange?: React.Dispatch<React.SetStateAction<FiltersState>>
  options?: Partial<
    Record<OptionColumnIds<TColumns>, ColumnOption[] | undefined>
  >
  faceted?: Partial<
    | Record<OptionColumnIds<TColumns>, Map<string, number> | undefined>
    | Record<NumberColumnIds<TColumns>, [number, number] | undefined>
  >
}

export function useDataTableFilters<
  TData,
  TColumns extends ReadonlyArray<ColumnConfig<TData, any, any, any>>,
  TStrategy extends FilterStrategy,
>({
  strategy,
  data,
  columnsConfig,
  defaultFilters,
  filters: externalFilters,
  onFiltersChange,
  options,
  faceted,
}: DataTableFiltersOptions<TData, TColumns, TStrategy>) {
  const [internalFilters, setInternalFilters] = useState<FiltersState>(
    defaultFilters ?? [],
  )

  if (
    (externalFilters && !onFiltersChange) ||
    (!externalFilters && onFiltersChange)
  ) {
    throw new Error(
      'If using controlled state, you must specify both filters and onFiltersChange.',
    )
  }

  const filters = externalFilters ?? internalFilters
  const setFilters = onFiltersChange ?? setInternalFilters

  // Convert ColumnConfig to Column, applying options and faceted options if provided
  const columns = useMemo(() => {
    const enhancedConfigs = columnsConfig.map((config) => {
      let final = config

      // Set options, if exists
      if (
        options &&
        (config.type === 'option' || config.type === 'multiOption')
      ) {
        const optionsInput = options[config.id as OptionColumnIds<TColumns>]
        if (!optionsInput || !isColumnOptionArray(optionsInput)) return config

        final = { ...final, options: optionsInput }
      }

      // Set faceted options, if exists
      if (
        faceted &&
        (config.type === 'option' || config.type === 'multiOption')
      ) {
        const facetedOptionsInput =
          faceted[config.id as OptionColumnIds<TColumns>]
        if (!facetedOptionsInput || !isColumnOptionMap(facetedOptionsInput))
          return config

        final = { ...final, facetedOptions: facetedOptionsInput }
      }

      // Set faceted min/max values, if exists
      if (config.type === 'number' && faceted) {
        const minMaxTuple = faceted[config.id as NumberColumnIds<TColumns>]
        if (!minMaxTuple || !isMinMaxTuple(minMaxTuple)) return config

        final = {
          ...final,
          min: minMaxTuple[0],
          max: minMaxTuple[1],
        }
      }

      return final
    })

    return createColumns(data, enhancedConfigs, strategy)
  }, [data, columnsConfig, options, faceted, strategy])

  const actions: DataTableFilterActions = useMemo(
    () => ({
      addFilterValue<TData, TType extends OptionBasedColumnDataType>(
        column: ColumnConfig<TData, TType>,
        values: FilterModel<TType>['values'],
      ) {
        if (column.type === 'option') {
          setFilters((prev) => {
            const filter = prev.find((f) => f.columnId === column.id)
            const isColumnFiltered = filter && filter.values.length > 0
            if (!isColumnFiltered) {
              return [
                ...prev,
                {
                  columnId: column.id,
                  type: column.type,
                  operator:
                    values.length > 1
                      ? DEFAULT_OPERATORS[column.type].multiple
                      : DEFAULT_OPERATORS[column.type].single,
                  values,
                },
              ]
            }
            const oldValues = filter.values
            const newValues = addUniq(filter.values, values)
            const newOperator = determineNewOperator(
              'option',
              oldValues,
              newValues,
              filter.operator,
            )
            return prev.map((f) =>
              f.columnId === column.id
                ? {
                    columnId: column.id,
                    type: column.type,
                    operator: newOperator,
                    values: newValues,
                  }
                : f,
            )
          })
          return
        }
        if (column.type === 'multiOption') {
          setFilters((prev) => {
            const filter = prev.find((f) => f.columnId === column.id)
            const isColumnFiltered = filter && filter.values.length > 0
            if (!isColumnFiltered) {
              return [
                ...prev,
                {
                  columnId: column.id,
                  type: column.type,
                  operator:
                    values.length > 1
                      ? DEFAULT_OPERATORS[column.type].multiple
                      : DEFAULT_OPERATORS[column.type].single,
                  values,
                },
              ]
            }
            const oldValues = filter.values
            const newValues = addUniq(filter.values, values)
            const newOperator = determineNewOperator(
              'multiOption',
              oldValues,
              newValues,
              filter.operator,
            )
            if (newValues.length === 0) {
              return prev.filter((f) => f.columnId !== column.id)
            }
            return prev.map((f) =>
              f.columnId === column.id
                ? {
                    columnId: column.id,
                    type: column.type,
                    operator: newOperator,
                    values: newValues,
                  }
                : f,
            )
          })
          return
        }
        throw new Error(
          '[data-table-filter] addFilterValue() is only supported for option columns',
        )
      },
      removeFilterValue<TData, TType extends OptionBasedColumnDataType>(
        column: ColumnConfig<TData, TType>,
        value: FilterModel<TType>['values'],
      ) {
        if (column.type === 'option') {
          setFilters((prev) => {
            const filter = prev.find((f) => f.columnId === column.id)
            const isColumnFiltered = filter && filter.values.length > 0
            if (!isColumnFiltered) {
              return [...prev]
            }
            const newValues = removeUniq(filter.values, value)
            const oldValues = filter.values
            const newOperator = determineNewOperator(
              'option',
              oldValues,
              newValues,
              filter.operator,
            )
            if (newValues.length === 0) {
              return prev.filter((f) => f.columnId !== column.id)
            }
            return prev.map((f) =>
              f.columnId === column.id
                ? {
                    columnId: column.id,
                    type: column.type,
                    operator: newOperator,
                    values: newValues,
                  }
                : f,
            )
          })
          return
        }
        if (column.type === 'multiOption') {
          setFilters((prev) => {
            const filter = prev.find((f) => f.columnId === column.id)
            const isColumnFiltered = filter && filter.values.length > 0
            if (!isColumnFiltered) {
              return [...prev]
            }
            const newValues = removeUniq(filter.values, value)
            const oldValues = filter.values
            const newOperator = determineNewOperator(
              'multiOption',
              oldValues,
              newValues,
              filter.operator,
            )
            if (newValues.length === 0) {
              return prev.filter((f) => f.columnId !== column.id)
            }
            return prev.map((f) =>
              f.columnId === column.id
                ? {
                    columnId: column.id,
                    type: column.type,
                    operator: newOperator,
                    values: newValues,
                  }
                : f,
            )
          })
          return
        }
        throw new Error(
          '[data-table-filter] removeFilterValue() is only supported for option columns',
        )
      },
      setFilterValue<TData, TType extends ColumnDataType>(
        column: ColumnConfig<TData, TType>,
        values: FilterModel<TType>['values'],
      ) {
        setFilters((prev) => {
          const filter = prev.find((f) => f.columnId === column.id)
          const isColumnFiltered = filter && filter.values.length > 0
          const newValues =
            column.type === 'number'
              ? createNumberFilterValue(values as number[])
              : column.type === 'date'
                ? createDateFilterValue(
                    values as [Date, Date] | [Date] | [] | undefined,
                  )
                : uniq(values)
          if (newValues.length === 0) return prev
          if (!isColumnFiltered) {
            return [
              ...prev,
              {
                columnId: column.id,
                type: column.type,
                operator:
                  values.length > 1
                    ? DEFAULT_OPERATORS[column.type].multiple
                    : DEFAULT_OPERATORS[column.type].single,
                values: newValues,
              },
            ]
          }
          const oldValues = filter.values
          const newOperator = determineNewOperator(
            column.type,
            oldValues,
            newValues,
            filter.operator,
          )
          const newFilter = {
            columnId: column.id,
            type: column.type,
            operator: newOperator,
            values: newValues as any,
          } satisfies FilterModel<TType>
          return prev.map((f) => (f.columnId === column.id ? newFilter : f))
        })
      },
      setFilterOperator<TType extends ColumnDataType>(
        columnId: string,
        operator: FilterModel<TType>['operator'],
      ) {
        setFilters((prev) =>
          prev.map((f) => (f.columnId === columnId ? { ...f, operator } : f)),
        )
      },
      removeFilter(columnId: string) {
        setFilters((prev) => prev.filter((f) => f.columnId !== columnId))
      },
      removeAllFilters() {
        setFilters([])
      },
    }),
    [setFilters],
  )

  return { columns, filters, actions, strategy } // columns is Column<TData>[]
}
