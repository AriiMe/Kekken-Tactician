import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  IconButton,
  TextField,
  Button,
  TableCell,
  TableRow,
  Table,
  TableBody,
  TableHead,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  Grid,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import renderInputImage from "../utils/renderInputImage";

const CustomCombos = () => {
  const [combos, setCombos] = useState(() => {
    const savedCombos = localStorage.getItem("customCombos");
    return savedCombos
      ? JSON.parse(savedCombos)
      : [
          {
            id: uuidv4(),
            launchers: [""],
            followUps: [[""]],
            editing: {
              launchers: false,
              followUps: false,
            },
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("customCombos", JSON.stringify(combos));
  }, [combos]);

  const handleDoubleClick = (comboIndex, part) => {
    setCombos(
      combos.map((combo, index) => {
        if (index === comboIndex) {
          return {
            ...combo,
            editing: { ...combo.editing, [part]: true },
          };
        }
        return combo;
      })
    );
  };

  const handleBlur = (comboIndex, part) => {
    setCombos(
      combos.map((combo, index) => {
        if (index === comboIndex) {
          return {
            ...combo,
            editing: { ...combo.editing, [part]: false },
          };
        }
        return combo;
      })
    );
  };

  const handleLauncherChange = (comboIndex, index, value) => {
    setCombos(
      combos.map((combo, idx) => {
        if (idx === comboIndex) {
          const newLaunchers = [...combo.launchers];
          newLaunchers[index] = value;
          return { ...combo, launchers: newLaunchers };
        }
        return combo;
      })
    );
  };

  const handleFollowUpChange = (comboIndex, index, subIndex, value) => {
    setCombos(
      combos.map((combo, idx) => {
        if (idx === comboIndex) {
          const newFollowUps = [...combo.followUps];
          if (value === "+") {
            // If the plus button was clicked, add a new follow-up to the current combo
            newFollowUps[index] = [...newFollowUps[index], ""];
          } else {
            if (subIndex !== undefined) {
              newFollowUps[index][subIndex] = value;
            } else {
              newFollowUps[index] = [value];
            }
          }
          return { ...combo, followUps: newFollowUps };
        }
        return combo;
      })
    );
  };
  const addNewRow = () => {
    setCombos([
      ...combos,
      {
        id: uuidv4(),
        launchers: [""],
        followUps: [[""]],
        editing: {
          launchers: false,
          followUps: false,
        },
      },
    ]);
  };

  const removeRow = (comboIndex) => {
    const newCombos = [...combos].filter((_, index) => index !== comboIndex);
    setCombos(newCombos);
  };

  // Function to check the type of input and convert it into a string for renderInputImage
  const normalizeInputForImage = (input) => {
    // If input is an array, join it, otherwise return as is assuming it's a string
    return Array.isArray(input) ? input.join(" ") : input;
  };

  return (
    <div className="custom-main-combos" style={{ marginTop: "100px" }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Customize and Create Main Combos
      </Typography>

      {/* ... */}
      <Table className="custom-combos-table">
        <TableHead>
          <TableRow>
            <TableCell>Launcher(s)</TableCell>
            <TableCell>Follow-Ups</TableCell>
            <TableCell>Delet</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {combos.map((combo, comboIndex) => (
            <TableRow key={combo.id}>
              <TableCell
                onDoubleClick={() => handleDoubleClick(comboIndex, "launchers")}
              >
                {combo.editing.launchers
                  ? combo.launchers.map((launcher, index) => (
                      <div key={index}>
                        <TextField
                          value={launcher}
                          onChange={(e) =>
                            handleLauncherChange(
                              comboIndex,
                              index,
                              e.target.value
                            )
                          }
                          onBlur={() => handleBlur(comboIndex, "launchers")}
                        />
                        {index === combo.launchers.length - 1 && (
                          <IconButton
                            onClick={() =>
                              handleLauncherChange(
                                comboIndex,
                                combo.launchers.length,
                                ""
                              )
                            }
                          >
                            <AddCircleIcon />
                          </IconButton>
                        )}
                      </div>
                    ))
                  : combo.launchers.map((launcher, index) => (
                      <div key={index}>{renderInputImage(launcher)}</div>
                    ))}
              </TableCell>
              <TableCell
                onDoubleClick={() => handleDoubleClick(comboIndex, "followUps")}
              >
                {combo.editing.followUps
                  ? combo.followUps.map((followUp, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", flexWrap: "wrap" }}
                      >
                        {followUp.map((item, subIndex) => (
                          <div key={subIndex}>
                            <TextField
                              value={item}
                              onChange={(e) =>
                                handleFollowUpChange(
                                  comboIndex,
                                  index,
                                  subIndex,
                                  e.target.value
                                )
                              }
                              onBlur={() => handleBlur(comboIndex, "followUps")}
                            />
                            {subIndex === followUp.length - 1 && (
                              <IconButton
                                onClick={() =>
                                  handleFollowUpChange(
                                    comboIndex,
                                    index,
                                    followUp.length,
                                    undefined,
                                    ""
                                  )
                                }
                              >
                                <AddCircleIcon />
                              </IconButton>
                            )}
                          </div>
                        ))}
                      </div>
                    ))
                  : combo.followUps.map((followUp, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", flexWrap: "wrap" }}
                      >
                        {followUp.map((item, subIndex) => (
                          <div key={subIndex}>
                            {renderInputImage(item)}
                            {subIndex < followUp.length - 1 && " > "}
                          </div>
                        ))}
                      </div>
                    ))}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => removeRow(comboIndex)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} align="center">
              <Button onClick={addNewRow} startIcon={<AddCircleIcon />}>
                Add New Combo
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="instructions">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          style={{ fontWeight: "bold" }}
        >
          Instructions:
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          align="center"
          style={{ fontWeight: "bold" }}
        >
          To add a new combo, click the "+ Add New Combo" button at the bottom
          of the table. To edit an existing combo, double-click on the cell you
          want to edit.
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          align="center"
          style={{ fontWeight: "bold" }}
        >
          To add a new launcher or follow-up, click the "+" button next to the
          last input field. To separate follow-ups into different sequences, add
          them in separate input fields.
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          align="center"
          style={{ marginTop: "20px", color: "red" }}
        >
          Note: Combos are saved currently on the browser. Clearing the cache
          will remove all your custom combos.
        </Typography>

        <Typography
          variant="body1"
          gutterBottom
          align="center"
          style={{ fontWeight: "bold" }}
        >
          For the launchers and follow-ups, input the commands separated by
          commas. Each command corresponds to an icon as follows:
        </Typography>
        <Grid container spacing={3} style={{ justifyContent: "center" }}>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="f: Forward" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="n: Neutral" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="df: Down-Forward" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="d: Down" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="db: Down-Back" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="b: Back" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="ub: Up-Back" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="u: Up" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="uf: Up-Forward" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="1: Left Punch" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="2: Right Punch" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="3: Left Kick" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="4: Right Kick" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="1+2: Left Punch + Right Punch" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="1+3: Left Punch + Left Kick" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="1+4: Left Punch + Right Kick" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="2+3: Right Punch + Left Kick" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="2+4: Right Punch + Right Kick" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="3+4: Left Kick + Right Kick" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="1+2+3: Left Punch + Right Punch + Left Kick" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="1+2+4: Left Punch + Right Punch + Right Kick" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="1+3+4: Left Punch + Left Kick + Right Kick" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="2+3+4: Right Punch + Left Kick + Right Kick" />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ListItem>
              <ListItemText primary="1+2+3+4: Left Punch + Right Punch + Left Kick + Right Kick" />
            </ListItem>
          </Grid>
          

{/* Holding Directions */}
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="~D: Hold Down" />
  </ListItem>
</Grid>
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="~DF: Hold Down-Forward" />
  </ListItem>
</Grid>
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="~DB: Hold Down-Back" />
  </ListItem>
</Grid>
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="~B: Hold Back" />
  </ListItem>
</Grid>
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="~F: Hold Forward" />
  </ListItem>
</Grid>
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="~UF: Hold Up-Forward" />
  </ListItem>
</Grid>
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="~UB: Hold Up-Back" />
  </ListItem>
</Grid>
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="~U: Hold Up" />
  </ListItem>
</Grid>

{/* Circular Motions */}
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="hcf: Half Circle Forward" />
  </ListItem>
</Grid>
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="hcb: Half Circle Back" />
  </ListItem>
</Grid>
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="qcf: Quarter Circle Forward" />
  </ListItem>
</Grid>
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="qcb: Quarter Circle Back" />
  </ListItem>
</Grid>
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="360: Full Circle" />
  </ListItem>
</Grid>
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="720: Full Circle Twice" />
  </ListItem>
</Grid>
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="dp: Dragon Punch Motion (f, d, df)" />
  </ListItem>
</Grid>
<Grid item xs={12} sm={6} md={4}>
  <ListItem>
    <ListItemText primary="rdp: Reverse Dragon Punch Motion (b, d, db)" />
  </ListItem>
</Grid>


        </Grid>
      </div>
    </div>
  );
};

export default CustomCombos;