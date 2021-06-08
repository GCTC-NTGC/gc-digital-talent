import * as React from 'react';
import { useAsyncDebounce } from 'react-table'

interface GlobalFilterProps {
    preGlobalFilteredRows: any
    globalFilter: any
    setGlobalFilter: any
}

const GlobalFilter : React.FC<GlobalFilterProps> = ({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) => {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
      setGlobalFilter(value || undefined)
    }, 200)

    return (
      <span>
        Search:{' '}
        <input
          value={value || ""}
          onChange={e => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`${count} records...`}
        />
      </span>
    )
}

export default GlobalFilter
