import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import useFetch from '../../hooks/useFetch';
import { idText } from 'typescript';

// Table
// fetched data from db
// records from Clipboard

// форма для простого селекта - данные из селекта рендерятся в таблицу - пагинация важна, тк строк может быть очень много. Возможность прервать рендер, если строк слишком много


//Record<string, any>
// table name 

// columns from Fetch.
interface Column {
// 
  id: string;
  colname: string;
  type: string | number;
  isPrimaryKey: boolean;
  isTimestamp: boolean;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

//columnsArray I become from fetched data
// minWidth/width based on column size, draggable
// label parse from ID, '_' replaced with ' '
const columns: readonly Column[] = [
  { id: 'name', colname: 'Name', minWidth: 170 },
  { id: 'code', colname: 'ISO\u00a0Code', minWidth: 100 },
  {
    id: 'population',
    colname: 'Population',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Size\u00a0(km\u00b2)',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'density',
    label: 'Density',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },
];

//data from my TableJSON
// function 
// I can't create interface Data, just
// interface Data {
//   name: string;
//   code: string;
//   population: number;
//   size: number;
//   density: number;
// }

function createData(
  name: string,
  code: string,
  population: number,
  size: number,
): Data {
  const density = population / size;
  return { name, code, population, size, density };
}

// rows I become from Clipboard
// function something like parseData, parseFromClipboard
const rows = [
  createData('First column', '', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019200, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126317000, 377973),
  createData('France', 'FR', 67022000, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 17098246),
  createData('Nigeria', 'NG', 200962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767),
];

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [columns, setColumns] = React.useState<Column[]>([]);
  const  { loading, error, sendRequest: getColumns } = useFetch();
  const [tableName, setTableName] = React.useState('s00d00');

// how should I describe Type of columnsObject, if I don't know size?
  const createTableHeader = ( columnsObject: any, applyFunction: Function) => {
    console.log(columnsObject[tableName]);
    // const loadedColumns = [];
    // for ( const columnKey in columnsObject) {
    //   loadedColumns.push({ id: columnsObject, label:columnsObject.colname, length: length})
    // }
    setColumns(columnsObject[tableName]);
  };

  React.useEffect(() => {
    getColumns({
// ? add aliases
      url: `http://localhost:9000/db.json`
    }, createTableHeader)
  }, [tableName])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.colname}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
