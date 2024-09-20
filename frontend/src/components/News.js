import React, { useEffect, useState } from 'react';
import { fetchNews } from '../services/newsService';
import { Grid, Card, CardContent, Typography, Button, CardActions, Box, Chip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SourceIcon from '@mui/icons-material/Source';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  // Define pastel color palette
  const pastelColors = ['#FEE2E2', '#FEF3C7', '#D1FAE5', '#DBEAFE', '#E9D5FF', '#FFF7ED'];

  useEffect(() => {
    const getNews = async () => {
      try {
        const newsData = await fetchNews();

        // Ensure newsData is an array
        if (Array.isArray(newsData)) {
          setArticles(newsData);
        } else {
          setError('Failed to fetch news or data format is incorrect.');
        }
      } catch (err) {
        setError('Error fetching news. Please try again later.');
      }
    };
    

    getNews();
  }, []);

  if (error) {
    return <Typography variant="h6" color="error" align="center">{error}</Typography>;
  }

 

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          align="center" 
          sx={{ fontWeight: 'bold', color: '#3b82f6', letterSpacing: 1.2, textTransform: 'uppercase' }}
        >
          Soccer Wealth Index
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {articles.map((article, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', 
                backgroundColor: pastelColors[index % pastelColors.length],
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': { 
                  transform: 'scale(1.02)', 
                  boxShadow: '0px 6px 30px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {article.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                  <CalendarTodayIcon fontSize="small" /> {new Date(article.publishedAt).toLocaleDateString()} - <SourceIcon fontSize="small" /> {article.source}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
                  {article.summary}
                </Typography>

                <Chip label="Soccer" sx={{ backgroundColor: '#eef4ff', color: '#3b82f6' }} />
              </CardContent>

              <CardActions>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  endIcon={<OpenInNewIcon />}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ marginRight: 2, textTransform: 'none' }}
                >
                  Read more
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default News;
