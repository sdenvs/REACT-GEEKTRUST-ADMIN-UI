import React, { useState, useEffect, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { Checkbox, Button, TextField, Box } from "@mui/material";
import { TailSpin } from "react-loader-spinner";
import DeleteIcon from "@mui/icons-material/Delete";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { width } from "@mui/system";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [SearchText, setSearchText] = useState("");

  const gridRef = useRef();

  const deleteButton = (params) => (
    <DeleteIcon
      onClick={() => {
        setEmployeeData((prev) =>
          prev.filter((eachItem) => eachItem.id !== params.data.id)
        );
      }}
    />
  );

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    { field: "role", headerName: "Role", flex: 1 },
    {
      headerName: "Delete",
      flex: 1,
      cellRenderer: deleteButton,
      editable: false,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      if (response.ok) {
        const respData = await response.json();
        setEmployeeData(respData);

        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteSelectedUser = () => {
    const updatedDataAfterDelete = employeeData.filter(
      (eachItem) => !selectedData.includes(eachItem.id)
    );
    setEmployeeData(updatedDataAfterDelete);
    setSelectedData([]);
  };
  const ChangeSearchText = (event) => {
    setSearchText(event.target.value);
  };

  const defauiltColDef = {
    sortable: true,
    filter: true,
    editable: true,
    resizable: true,
  };

  const onRowValueChanged = useCallback((event) => {
    const RowUpdatedData = event.data;
    console.log(RowUpdatedData);
    setEmployeeData((prev) =>
      prev.map((eachItem) => {
        if (eachItem.id === RowUpdatedData.id) {
          return RowUpdatedData;
        }
        return eachItem;
      })
    );
  }, []);

  const onRowSelected = useCallback((event) => {
    const rowCount = event.data;
    const rowNode = event.node;
    if (rowNode.isSelected()) {
      setSelectedData((prev) => [...prev, rowCount.id]);
    } else {
      setSelectedData((prev) =>
        prev.filter((eachItem) => eachItem !== rowCount.id)
      );
    }
  }, []);

  const renderEmployes = () => {
    const FilteredList = employeeData.filter(
      (eachItem) =>
        eachItem.name.toLowerCase().includes(SearchText.toLowerCase()) ||
        eachItem.email.toLowerCase().includes(SearchText.toLowerCase()) ||
        eachItem.role.toLowerCase().includes(SearchText.toLowerCase())
    );
    return (
      <Box sx={{ p: 3 }}>
        <div>
          <h1>All Admin Details</h1>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <h3>Note: {"  "}</h3>
            <p>Double Click the row to edit</p>
          </Box>
          <TextField
            sx={{ pb: 2 }}
            onChange={ChangeSearchText}
            fullWidth
            value={SearchText}
            size="small"
            id="outlined-basic"
            label="Search For Employee By Name, Email & Role"
            variant="outlined"
          />
          <div className="ag-theme-alpine" style={{ height: 500 }}>
            <AgGridReact
              ref={gridRef}
              rowData={FilteredList}
              columnDefs={columns}
              defaultColDef={defauiltColDef}
              editType="fullRow"
              onRowValueChanged={onRowValueChanged}
              pagination={true}
              paginationPageSize={10}
              rowSelection={"multiple"}
              onRowSelected={onRowSelected}
              suppressRowClickSelection={true}
            ></AgGridReact>
          </div>
          <Button
            onClick={deleteSelectedUser}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete Selected User
          </Button>
        </div>
      </Box>
    );
  };
  const renderLoading = () => (
    <div>
      <TailSpin color="#00BFFF" height={80} width={80} />
    </div>
  );
  return <div>{isLoading ? renderLoading() : renderEmployes()}</div>;
};

export default Home;
