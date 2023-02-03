import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { Divider, Typography, Button, Box } from "@mui/material";
import { Grid, makeStyles, Container } from "@material-ui/core";

import api from "../../API/baseURL";
import * as url from "../../API/urls";
import NewEditBatch from "../../components/BatchesFeed/NewEditBatch";
import DataTable from "../../components/DataTables/DataTable";

const useStyles = makeStyles(() => ({}));

function ArchivedBatchesFeed() {
  const classes = useStyles();

  const [batchesData, setBatchesData] = useState([]);

  // Table columns definition
  const columns = [
    {
      field: "id",
      headerName: "Details",
      width: 300,
      renderCell: (params) => (
        <>
          <Grid container>
            <Grid item xs={12} md={12} xl={6}>
              <Box marginTop={1} textAlign="center">
                <NavLink to={`/app/batch/${params.value}`}>
                  <Button variant="contained">Details</Button>
                </NavLink>
              </Box>
            </Grid>
            <Grid item xs={12} md={12} xl={6}>
              <Box marginTop={1} textAlign="center">
                <NewEditBatch
                  onEditedBatch={editBatch}
                  buttonName="Edit Batch"
                  batchInfo={batchesData.find((x) => x.id === params.value)}
                />
              </Box>
            </Grid>
          </Grid>
        </>
      ),
    },
    { field: "batchName", headerName: "Batch Name", width: 150 },
    { field: "ownerName", headerName: "Owner Name", width: 250 },
    { field: "description", headerName: "Batch Description", width: 250 },
  ];

  // GET BATCHES
  const fetchBatchesData = async () => {
    try {
      const response = await api.get(url.GET_ALL_ARCHIVED_BATCHES);
      setBatchesData(response.data);
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  };

  useEffect(() => {
    fetchBatchesData();
  }, []);

  // PUT BATCH

  const editBatch = async (editedBatch, batchID) => {
    try {
      const response = await api.put(url.putBatch(batchID), editedBatch);
      setBatchesData(
        batchesData
          .map((obj) => (obj.id === response.data.id ? response.data : obj))
          .filter((obj) => obj.active === false)
      );
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  };

  return (
    <Container className={classes.container}>
      <Box marginBottom={2} marginTop={2}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" className={classes.feedTitle}>
              Archived Batches
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider></Divider>
      <Box marginBottom={2} marginTop={2}>
        <Typography variant="p">
          In this page all archived batches are presented, you can still see all
          the assignments and users, but all of them are unactive. If you want
          to activate batch and all of its contents, please edit it and set it
          to active.
        </Typography>
      </Box>

      {batchesData.length === 0 ? (
        "No data available"
      ) : (
        <DataTable tableData={batchesData} columns={columns} />
      )}
    </Container>
  );
}

export default ArchivedBatchesFeed;
