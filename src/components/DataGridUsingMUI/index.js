import React from "react";
import { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Checkbox, Button, TextField } from "@mui/material";
import { GridCellEditCommitParams } from "@mui/x-data-grid";

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [SearchText, setSearchText] = useState("");

  const handleCommit = (params) => {
    console.log(params);
  };

  const DeleteUserData = (id) => {
    const updatedData = employeeData.filter((eachItem) => eachItem.id !== id);
    setEmployeeData(updatedData);
  };
  const userChecked = (id) => {
    selectedData.push(id);
    console.log(id);
  };

  const columns = [
    {
      field: "select",
      type: "actions",

      getActions: (params) => [
        <Checkbox onChange={() => userChecked(params.id)} />,
      ],
    },
    { field: "name", headerName: "Name", flex: 1, editable: true },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      type: "email",
      editable: true,
    },
    { field: "role", headerName: "Role", flex: 1, editable: true },
    {
      field: "delete",
      type: "actions",

      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          onClick={() => DeleteUserData(params.id)}
          label="Delete"
        />,
      ],
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

  const renderEmployes = () => {
    const FilteredList = employeeData.filter((eachItem) =>
      eachItem.name.toLowerCase().includes(SearchText.toLowerCase())
    );
    return (
      <div>
        <TextField
          onChange={ChangeSearchText}
          id="outlined-basic"
          label="Search For Employee By Name"
          variant="outlined"
        />

        <div style={{ width: "100%" }}>
          <DataGrid
            rows={FilteredList}
            columns={columns}
            editMode="row"
            autoHeight
            pageSize={10}
            pagination
            sx={{
              boxShadow: 2,
              border: 2,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
          />
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
    );
  };

  const renderLoading = () => (
    <div>
      <TailSpin color="#00BFFF" height={80} width={80} />
    </div>
  );
  return <div>{isLoading ? renderLoading() : renderEmployes()}</div>;
}

export default Home;
