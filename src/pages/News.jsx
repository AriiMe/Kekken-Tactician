import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { Helmet } from "react-helmet";

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const api = import.meta.env.VITE_GNEWS;
      try {
        const response = await axios.get(
          `https://gnews.io/api/v4/search?q=tekken&lang=en&country=us&max=10&apikey=${api}`
        );

        setNews(response.data.articles);
      } catch (error) {
        console.error("Failed to fetch news", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <>
      <Helmet>
        <title>Tekken 8 News</title>
        <meta
          name="description"
          content="Stay updated with the latest news and updates about Tekken 8. Learn about new characters, updates, strategies, and more."
        />
        <meta
          name="keywords"
          content={news
            .map(
              (article) =>
                `${article.title}, Tekken 8 news, Tekken 8 updates, Tekken 8 strategies, Tekken 8 gameplay, Tekken 8 characters`
            )
            .join(", ")}
        />
      </Helmet>
      <Container sx={{ marginTop: "250px", marginBottom: "50px" }}>
        <h1
          style={{
            textAlign: "center",
            width: "100%",
            color: "#d42f2f",
          }}
        >
          TEKKEN NEWS 
        </h1>
        <Grid container spacing={3}>
          {news.map((article, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Link
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: "none" }}
              >
                <CardActionArea>
                  <Card sx={{ width: 345, height: "470px" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={article.image}
                      alt={article.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {article.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {article.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </CardActionArea>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default News;
