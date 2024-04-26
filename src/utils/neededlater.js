<div className="instructions">
  <Typography variant="h4" gutterBottom align="center">
    Input Legend
  </Typography>
  <Grid container spacing={3} style={{ justifyContent: "center" }}>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="f: Forward" secondary={test("f")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="n: Neutral" secondary={test("n")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="df: Down-Forward" secondary={test("df")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="d: Down" secondary={test("d")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="db: Down-Back" secondary={test("db")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="b: Back" secondary={test("b")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="ub: Up-Back" secondary={test("ub")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="u: Up" secondary={test("u")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="uf: Up-Forward" secondary={test("uf")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="1: Left Punch" secondary={test("1")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="2: Right Punch" secondary={test("2")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="3: Left Kick" secondary={test("3")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="4: Right Kick" secondary={test("4")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText
          primary="1+2: Left Punch + Right Punch"
          secondary={test("1+2")}
        />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText
          primary="1+3: Left Punch + Left Kick"
          secondary={test("1+3")}
        />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText
          primary="1+4: Left Punch + Right Kick"
          secondary={test("1+4")}
        />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText
          primary="2+3: Right Punch + Left Kick"
          secondary={test("2+3")}
        />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText
          primary="2+4: Right Punch + Right Kick"
          secondary={test("2+4")}
        />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText
          primary="3+4: Left Kick + Right Kick"
          secondary={test("3+4")}
        />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText
          primary="1+2+3: Left Punch + Right Punch + Left Kick"
          secondary={test("1+2+3")}
        />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText
          primary="1+2+4: Left Punch + Right Punch + Right Kick"
          secondary={test("1+2+4")}
        />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText
          primary="1+3+4: Left Punch + Left Kick + Right Kick"
          secondary={test("1+3+4")}
        />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText
          primary="2+3+4: Right Punch + Left Kick + Right Kick"
          secondary={test("2+3+4")}
        />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText
          primary="1+2+3+4: Left Punch + Right Punch + Left Kick + Right Kick"
          secondary={test("1+2+3+4")}
        />
      </ListItem>
    </Grid>

    {/* Holding Directions */}
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="~D: Hold Down" secondary={test("~D")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText
          primary="~DF: Hold Down-Forward"
          secondary={test("~DF")}
        />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="~DB: Hold Down-Back" secondary={test("~DB")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="~B: Hold Back" secondary={test("~B")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="~F: Hold Forward" secondary={test("~F")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="~UF: Hold Up-Forward" secondary={test("~UF")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="~UB: Hold Up-Back" secondary={test("~UB")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="~U: Hold Up" secondary={test("~U")} />
      </ListItem>
    </Grid>

    {/* Circular Motions */}
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText
          primary="hcf: Half Circle Forward"
          secondary={test("hcf")}
        />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText primary="hcb: Half Circle Back" secondary={test("hcb")} />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText
          primary="qcf: Quarter Circle Forward"
          secondary={test("qcf")}
        />
      </ListItem>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <ListItem>
        <ListItemText
          primary="qcb: Quarter Circle Back"
          secondary={test("qcb")}
        />
      </ListItem>
    </Grid>
  </Grid>
</div>;
