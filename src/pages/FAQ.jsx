import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

const paragraphStyle = {
  fontSize: "1.2rem",
  textAlign: "center",
  width: "70%",
  margin: "2rem auto",
  fontFamily: "Michroma",
  letterSpacing: "1px",
  lineHeight: "2",
  "@media (max-width: 1100px)": {
    fontSize: ".8rem",
    width: "90%",
  },
};

const FAQ = () => {
  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          pt: 20,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            color: "rgba(212, 47, 47, 1)",
            fontFamily: "Michroma",
            width: "70%",
            margin: "0 auto 3rem",
            "@media (max-width: 1100px)": {
              fontSize: "2rem",
              width: "90%",
            },
          }}
        >
          FAQ
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          <span
            style={{
              color: "#c62828",
            }}
          >
            Q:
          </span>{" "}
          Why is the website so slow?
          <br />
          <br />{" "}
          <span
            style={{
              color: "#c62828",
            }}
          >
            A:
          </span>{" "}
          The website is hosted on a Starter Pack Render server, which are paid
          by me personally, unless we get more supporters I don't plan on
          upgrading them.
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          <span
            style={{
              color: "#c62828",
            }}
          >
            Q:
          </span>{" "}
          Will there be a mobile app?
          <br />
          <br />
          <span
            style={{
              color: "#c62828",
            }}
          >
            A:
          </span>{" "}
          currently, there are no plans for a mobile app, but the website is
          optimized for mobile use.
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          <span
            style={{
              color: "#c62828",
            }}
          >
            Q:
          </span>{" "}
          Can I contribute to the website? Can I request a character to be
          updated? Can I request a feature? etc...
          <br />
          <br />
          <span
            style={{
              color: "#c62828",
            }}
          >
            A:
          </span>{" "}
          Yes, you can contribute to the website by contacting us on our
          <Link
            href="https://discord.gg/d2Czp4Kj75"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Discord server
          </Link>
          .
        </Typography>

        <Typography variant="body1" sx={paragraphStyle}>
          <span
            style={{
              color: "#c62828",
            }}
          >
            Q:
          </span>{" "}
          How do I use the combo generator?
          <br />
          <br />
          <span
            style={{
              color: "#c62828",
            }}
          >
            A:
          </span>{" "}
          The combo generator is a tool that allows you to create your own
          combos, you can find the instructions on the same page below the combo
          generator.
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          <span
            style={{
              color: "#c62828",
            }}
          >
            Q:
          </span>{" "}
          How do I use the anti-guide?
          <br />
          <br />
          <span
            style={{
              color: "#c62828",
            }}
          >
            A:
          </span>{" "}
          The anti-guide is a tool that allows you to find the best moves to use
          against a specific character, it is currently under development so
          stay tuned.
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          <span
            style={{
              color: "#c62828",
            }}
          >
            Q:
          </span>{" "}
          Will there be Ads on the website?
          <br />
          <br />
          <span
            style={{
              color: "#c62828",
            }}
          >
            A:
          </span>{" "}
          Currently there are no plans to add Ads to the website, we hate
          aggressive ads as much as you do. But if you want to support us and
          wish to have better performance you can donate on our{" "}
          <Link
            href="https://ko-fi.com/ariime"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Ko-fi page
          </Link>
          .
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          <span
            style={{
              color: "#c62828",
            }}
          >
            Q:
          </span>{" "}
          What is the support money used for?
          <br />
          <br />
          <span
            style={{
              color: "#c62828",
            }}
          >
            A:
          </span>{" "}
          The support money is used to pay for the servers, domain, and cloud
          storage for Images and Videos. I'm not expecting to make a living out
          of this, but I would like to cover the costs of the website.
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          <span
            style={{
              color: "#c62828",
            }}
          >
            Q:
          </span>{" "}
          What are your future plans for the website?
          <br />
          <br />
          <span
            style={{
              color: "#c62828",
            }}
          >
            A:
          </span>{" "}
          I plan on adding more features to the website, such as the anti-guide,
          more characters and more combos, also plans on adding a feature that
          allows you to create/ pick your own character and edit existing
          combos. Moreover There are plans to add user Interactions: such as
          comments, likes, and sharing. In the future we might add support for
          other games such as Mortal Kombat and Street Fighter.
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          <span
            style={{
              color: "#c62828",
            }}
          >
            Q:
          </span>{" "}
          Why in the hell is the button in footer off center and doesn't
          work??!! {">:("}
          <br />
          <br />
          <span
            style={{
              color: "#c62828",
            }}
          >
            A:
          </span>{" "}
          KEKW
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          <span
            style={{
              color: "#c62828",
            }}
          >
            Q:
          </span>{" "}
          Why is the website called Tekken Tactician?
          <br />
          <br />
          <span
            style={{
              color: "#c62828",
            }}
          >
            A:
          </span>{" "}
          idk lol
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          <span
            style={{
              color: "#c62828",
            }}
          >
            Q:
          </span>{" "}
          What is the meaning of life?
          <br />
          <br />
          <span
            style={{
              color: "#c62828",
            }}
          >
            A:
          </span>{" "}
          Jun's Feet Pics
        </Typography>
      </Box>
    </Container>
  );
};

export default FAQ;
