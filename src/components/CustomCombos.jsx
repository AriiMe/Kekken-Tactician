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
import domtoimage from "dom-to-image";
import { Helmet } from "react-helmet";
import Link from "@mui/material/Link";

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
              launchers: true,
              followUps: true,
            },
          },
        ];
  });

  const rowRefs = combos.map(() => React.createRef());

  useEffect(() => {
    localStorage.setItem("customCombos", JSON.stringify(combos));
  }, [combos]);

  const handleDoubleClick = (comboIndex, part) => {
    setCombos((prevCombos) =>
      prevCombos.map((combo, index) =>
        index === comboIndex
          ? { ...combo, editing: { ...combo.editing, [part]: true } }
          : combo
      )
    );
  };

  const handleBlur = (comboIndex, part) => {
    setCombos((prevCombos) =>
      prevCombos.map((combo, index) =>
        index === comboIndex
          ? {
              ...combo,
              editing: {
                ...combo.editing,
                [part]:
                  part === "followUps"
                    ? combo[part].some((subArray) =>
                        subArray.some((item) => item.trim() === "")
                      )
                    : combo[part].some((item) => item.trim() === ""),
              },
            }
          : combo
      )
    );
  };

  const handleLauncherChange = (comboIndex, index, value) => {
    setCombos((prevCombos) =>
      prevCombos.map((combo, comboIdx) =>
        comboIdx === comboIndex
          ? {
              ...combo,
              launchers:
                index < combo.launchers.length
                  ? combo.launchers.map((launcher, launcherIdx) =>
                      launcherIdx === index ? value : launcher
                    )
                  : [...combo.launchers, ""],
              editing: {
                ...combo.editing,
                launchers: true,
              },
            }
          : combo
      )
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
          launchers: true,
          followUps: true,
        },
      },
    ]);
  };

  const removeRow = (comboIndex) => {
    const newCombos = [...combos].filter((_, index) => index !== comboIndex);
    setCombos(newCombos);
  };

  const deleteLauncher = (comboIndex, launcherIndex) => {
    setCombos((prevCombos) =>
      prevCombos.map((combo, comboIdx) =>
        comboIdx === comboIndex
          ? {
              ...combo,
              launchers:
                combo.launchers.length > 1
                  ? combo.launchers.filter(
                      (_, index) => index !== launcherIndex
                    )
                  : combo.launchers,
            }
          : combo
      )
    );
  };

  const deleteFollowUp = (comboIndex, followUpIndex, itemIndex) => {
    setCombos(
      combos.map((combo, index) => {
        if (index === comboIndex) {
          const newFollowUps = [...combo.followUps];
          const newFollowUp = [...newFollowUps[followUpIndex]];
          newFollowUp.splice(itemIndex, 1);
          newFollowUps[followUpIndex] = newFollowUp;
          return { ...combo, followUps: newFollowUps };
        }
        return combo;
      })
    );
  };

  // Function to check the type of input and convert it into a string for renderInputImage
  const normalizeInputForImage = (input) => {
    // If input is an array, join it, otherwise return as is assuming it's a string
    return Array.isArray(input) ? input.join(" ") : input;
  };

  const pageTitle = "Tekken 8 Combo Generator";
  const pageDescription =
    "Create and customize your own custom combos for Tekken 8 characters. Learn and store your favorite launchers and follow ups to improve your gameplay. Export and save transparent images of your custom combos.";
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

  const saveRowAsImage = (rowElement) => {
    // Create a new element
    const clone = rowElement.cloneNode(true);
    // Create a container for the cloned element
    const container = document.createElement("div");
    container.appendChild(clone);

    // Scale the content of the container
    container.style.transform = "scale(1.5)";
    container.style.transformOrigin = "top left";

    // Remove the delete and save buttons
    const deleteButton = clone.querySelector("#delete-button-for-image");
    const saveButton = clone.querySelector("#save-button-for-image");
    deleteButton && deleteButton.remove();
    saveButton && saveButton.remove();

    // Create a watermark element
    const watermark = document.createElement("div");
    watermark.textContent = "tekkentactician.com";
    watermark.style.position = "relative";
    watermark.style.width = "100%";
    watermark.style.textAlign = "center";
    watermark.style.color = "#d42f2f";
    watermark.style.right = "40%";
    watermark.style.top = "-17px";
    watermark.style.fontSize = "12px";
    watermark.style.fontWeight = "bold";
    watermark.style.opacity = "0.6";

    // Append the watermark to the clone
    clone.appendChild(watermark);

    // Append the clone to body
    document.body.appendChild(clone);

    // Pass the new element to domtoimage
    domtoimage
      .toPng(clone)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "combination.png";
        link.href = dataUrl;
        link.click();

        // Remove the clone from body
        document.body.removeChild(clone);
      })
      .catch((error) => {
        console.error("oops, something went wrong!", error);

        // Remove the clone from body in case of error
        document.body.removeChild(clone);
      });
  };
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
        Tekken 8 Combo Generator
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
            <TableCell style={{ color: "#d42f2f" }}>ScreenShot</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {combos.map((combo, comboIndex) => (
            <TableRow key={combo.id} ref={rowRefs[comboIndex]}>
              <TableCell
                className="launcher"
                onDoubleClick={() => handleDoubleClick(comboIndex, "launchers")}
              >
                {combo.launchers.map((launcher, index) =>
                  combo.editing.launchers ? (
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
                      {combo.launchers.length > 1 && (
                        <IconButton
                          onClick={() => deleteLauncher(comboIndex, index)}
                        >
                          <DeleteIcon style={{ color: "#d42f2f" }} />
                        </IconButton>
                      )}
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
                    </div>
                  ) : (
                    <div key={index}>{renderInputImage(launcher)}</div>
                  )
                )}
              </TableCell>
              <TableCell
                className="follow-ups"
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
                            {followUp.length > 1 && (
                              <IconButton
                                onClick={() =>
                                  deleteFollowUp(comboIndex, index, subIndex)
                                }
                              >
                                <DeleteIcon style={{ color: "#d42f2f" }} />
                              </IconButton>
                            )}
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
                  : combo.followUps.map((followUp, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", flexWrap: "wrap" }}
                      >
                        <div
                          className="watermark"
                          style={{
                            position: "relative",
                            width: "100%",
                            textAlign: "center",
                            color: "#d42f2f",
                            right: "40%",
                            top: "-17px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            opacity: "0.6",
                            display: "none",
                          }}
                        >
                          tekkentactician.com
                        </div>
                        {followUp.map((item, subIndex) => (
                          <div
                            key={subIndex}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {renderInputImage(item)}
                            {subIndex < followUp.length - 1 && (
                              <span className="input-gap">
                                <img
                                  className="input-icons "
                                  src="/icons-t8/into.png"
                                  alt="into"
                                />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => removeRow(comboIndex)}>
                  <DeleteIcon
                    id="delete-button-for-image"
                    style={{ color: "#d42f2f" }}
                  />
                </IconButton>
              </TableCell>
              <TableCell>
                <Button
                  id="save-button-for-image"
                  onClick={() => saveRowAsImage(rowRefs[comboIndex].current)}
                >
                  Save as Image
                </Button>
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
          variant="body1"
          gutterBottom
          align="center"
          style={{ fontWeight: "bold" }}
        >
          To Save the full row of your custom Combos as a transparent PNG file
          click Save as image (duh).
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          align="center"
          style={{ marginTop: "20px", color: "#d42f2f" }}
        >
          Note: Combos are saved currently on the browser. Clearing the cache
          will remove all your custom combos.
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          align="center"
          style={{ marginTop: "20px" }}
        >
          Again a big thanks to{" "}
          <Link
            href="https://www.reddit.com/user/natayaway/"
            target="_blank"
            rel="noopener noreferrer"
          >
            u/natayaway
          </Link>{" "}
          and{" "}
          <Link
            href="https://www.reddit.com/user/cantbelieveudonethi5/"
            target="_blank"
            rel="noopener noreferrer"
          >
            u/cantbelieveudonethi5
          </Link>{" "}
          for the Amazing Icons.
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          align="center"
          style={{ fontWeight: "bold" }}
        >
          For the launchers and follow-ups, input the commands are separated by
          a space.It isn't case sensetive so it doesn't matter if you upper- or
          lower-case them . Each command corresponds to an icon as follows:
        </Typography>

        <div className="instructions">
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ color: "#d42f2f" }}
          >
            Input Legend
          </Typography>

          <Grid container spacing={3} style={{ justifyContent: "center" }}>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="CH: Counter Hit"
                  secondary={renderInputImage("ch")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="BT: Back Turned"
                  secondary={renderInputImage("bt")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="T: Tornado(spin)"
                  secondary={renderInputImage("t")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="chip: Chip Damage"
                  secondary={renderInputImage("chip")}
                />
              </ListItem>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="heat: Heat"
                  secondary={renderInputImage("heat")}
                />
              </ListItem>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="launch: Launched State"
                  secondary={renderInputImage("launch")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="PC: Power Crush"
                  secondary={renderInputImage("pc")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="FB: Floor Break"
                  secondary={renderInputImage("fb")}
                />
              </ListItem>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="WB: Wall Break"
                  secondary={renderInputImage("wb")}
                />
              </ListItem>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="homing: Homing"
                  secondary={renderInputImage("homing")}
                />
              </ListItem>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="]: Bracket Right"
                  secondary={renderInputImage("]")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="[: Bracket Left"
                  secondary={renderInputImage("[")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="SS: Side Step"
                  secondary={renderInputImage("ss")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="SSR: Side Step Right"
                  secondary={renderInputImage("ssr")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="SSL: Side Step Left"
                  secondary={renderInputImage("ssl")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="WR: While Running"
                  secondary={renderInputImage("wr")}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ListItem>
                <ListItemText
                  primary="WS: While Standing"
                  secondary={renderInputImage("ws")}
                />
              </ListItem>
            </Grid>
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
