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
import { Helmet } from "react-helmet";

import "./CustomCombos.css";

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

  const pageTitle = "Customize Main Combos for Tekken 8";
  const pageDescription =
    "Create and customize your main combos for Tekken 8 characters. Learn and store your favorite launcher and follow-up sequences to improve your gameplay.";
  const keywords = [
    "Tekken 8 combos",
    "custom combos",
    "fighting game strategies",
    "Tekken 8 customization",
    "Tekken 8 guides",
    "combo creation",
    "video game strategies",
    "Tekken 8 tips",
    "gameplay improvement",
    "combo creator",
    "combo generator",
    "tekken combo creator",
    "tekken combo generator",
    "tekken 8 combo creator",
    "tekken 8 combo generator",
  ].join(", ");

  return (
    <div className="custom-main-combos" style={{ marginTop: "100px" }}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: pageTitle,
            description: pageDescription,
            keywords: keywords.split(", "),
          })}
        </script>
      </Helmet>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          fontWeight: "bold",
          color: "rgba(212, 47, 47, 1)",
        }}
      >
        Customize and Create Main Combos
      </Typography>

      {/* ... */}
      <Table className="custom-combos-table" sx={{ marginTop: "50px" }}>
        <TableHead>
          <TableRow>
            <TableCell className="launcher" style={{ color: "#d42f2f" }}>
              Launcher(s)
            </TableCell>
            <TableCell className="follow-ups" style={{ color: "#d42f2f" }}>
              Follow-Ups
            </TableCell>
            <TableCell style={{ color: "#d42f2f" }}>Delet</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {combos.map((combo, comboIndex) => (
            <TableRow key={combo.id}>
              <TableCell
                className="launcher"
                onDoubleClick={() => handleDoubleClick(comboIndex, "launchers")}
              >
                {combo.editing.launchers ? (
                  combo.launchers.map((launcher, index) => (
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
                          <AddCircleIcon style={{ color: "#d42f2f" }} />
                        </IconButton>
                      )}
                    </div>
                  ))
                ) : combo.launchers.length === 0 ||
                  combo.launchers.every((launcher) => launcher === "") ? (
                  <Typography style={{ color: "#d42f2f", fontWeight: "bold" }}>
                    Double click here to add launcher
                  </Typography>
                ) : (
                  combo.launchers.map((launcher, index) => (
                    <div key={index}>{renderInputImage(launcher)}</div>
                  ))
                )}
              </TableCell>
              <TableCell
                className="follow-ups"
                onDoubleClick={() => handleDoubleClick(comboIndex, "followUps")}
              >
                {combo.editing.followUps ? (
                  combo.followUps.map((followUp, index) => (
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
                                  ""
                                )
                              }
                            >
                              <AddCircleIcon style={{ color: "#d42f2f" }} />
                            </IconButton>
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                ) : combo.followUps.length === 0 ||
                  combo.followUps.every((followUpArray) =>
                    followUpArray.every((followUp) => followUp === "")
                  ) ? (
                  <Typography style={{ color: "#d42f2f", fontWeight: "bold" }}>
                    Double click here to add follow up
                  </Typography>
                ) : (
                  combo.followUps.map((followUp, index) => (
                    <div
                      key={index}
                      style={{ display: "flex", flexWrap: "wrap" }}
                    >
                      {followUp.map((item, subIndex) => (
                        <div
                          key={subIndex}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          {renderInputImage(item)}
                          {subIndex < followUp.length - 1 && (
                            <span className="input-gap">{">"}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </TableCell>

              <TableCell>
                <IconButton onClick={() => removeRow(comboIndex)}>
                  <DeleteIcon style={{ color: "#d42f2f" }} />
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
          style={{ fontWeight: "bold", margin: "50px 50px", color: "#d42f2f" }}
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

        <div className="instructions">
          <Typography variant="h4" gutterBottom align="center">
            Input Legend
          </Typography>
          <Grid container spacing={3} style={{ justifyContent: "center" }}>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="f: Forward"
                  secondary={renderInputImage("f")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="n: Neutral"
                  secondary={renderInputImage("n")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="df: Down-Forward"
                  secondary={renderInputImage("df")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="d: Down"
                  secondary={renderInputImage("d")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="db: Down-Back"
                  secondary={renderInputImage("db")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="b: Back"
                  secondary={renderInputImage("b")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="ub: Up-Back"
                  secondary={renderInputImage("ub")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="u: Up"
                  secondary={renderInputImage("u")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="uf: Up-Forward"
                  secondary={renderInputImage("uf")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="1: Left Punch"
                  secondary={renderInputImage("1")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="2: Right Punch"
                  secondary={renderInputImage("2")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="3: Left Kick"
                  secondary={renderInputImage("3")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="4: Right Kick"
                  secondary={renderInputImage("4")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="1+2: Left Punch + Right Punch"
                  secondary={renderInputImage("1+2")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="1+3: Left Punch + Left Kick"
                  secondary={renderInputImage("1+3")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="1+4: Left Punch + Right Kick"
                  secondary={renderInputImage("1+4")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="2+3: Right Punch + Left Kick"
                  secondary={renderInputImage("2+3")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="2+4: Right Punch + Right Kick"
                  secondary={renderInputImage("2+4")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="3+4: Left Kick + Right Kick"
                  secondary={renderInputImage("3+4")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="1+2+3: Left Punch + Right Punch + Left Kick"
                  secondary={renderInputImage("1+2+3")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="1+2+4: Left Punch + Right Punch + Right Kick"
                  secondary={renderInputImage("1+2+4")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="1+3+4: Left Punch + Left Kick + Right Kick"
                  secondary={renderInputImage("1+3+4")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="2+3+4: Right Punch + Left Kick + Right Kick"
                  secondary={renderInputImage("2+3+4")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="1+2+3+4: Left Punch + Right Punch + Left Kick + Right Kick"
                  secondary={renderInputImage("1+2+3+4")}
                />
              </ListItem>
            </Grid>

            {/* Holding Directions */}
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="~D: Hold Down"
                  secondary={renderInputImage("~D")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="~DF: Hold Down-Forward"
                  secondary={renderInputImage("~DF")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="~DB: Hold Down-Back"
                  secondary={renderInputImage("~DB")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="~B: Hold Back"
                  secondary={renderInputImage("~B")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="~F: Hold Forward"
                  secondary={renderInputImage("~F")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="~UF: Hold Up-Forward"
                  secondary={renderInputImage("~UF")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="~UB: Hold Up-Back"
                  secondary={renderInputImage("~UB")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="~U: Hold Up"
                  secondary={renderInputImage("~U")}
                />
              </ListItem>
            </Grid>

            {/* Circular Motions */}
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="hcf: Half Circle Forward"
                  secondary={renderInputImage("hcf")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="hcb: Half Circle Back"
                  secondary={renderInputImage("hcb")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="qcf: Quarter Circle Forward"
                  secondary={renderInputImage("qcf")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="qcb: Quarter Circle Back"
                  secondary={renderInputImage("qcb")}
                />
              </ListItem>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default CustomCombos;
