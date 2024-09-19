import React, { useEffect, useState } from 'react';
import { fetchNews } from '../services/newsService';
import { Grid, Card, CardContent, Typography, Button, CardActions, Box, Chip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SourceIcon from '@mui/icons-material/Source';

const News = () => {
  const [articles, setArticles] = useState([]);
  
  // Define pastel color palette
  const pastelColors = ['#FEE2E2', '#FEF3C7', '#D1FAE5', '#DBEAFE', '#E9D5FF', '#FFF7ED'];

  useEffect(() => {
    const getNews = async () => {
      const newsData = await fetchNews();
      setArticles(newsData);
    };

    getNews();
  }, []);

  return (
    <div>
      {/* Enhanced and Centered Header */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          align="center" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#3b82f6',  // Blue accent color
            letterSpacing: 1.2, // Slight letter spacing for a clean look
            textTransform: 'uppercase', // Optional: Make the header uppercase
          }}
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
                backgroundColor: pastelColors[index % pastelColors.length],  // Apply color in sequence
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',    // Transition for smooth hover
                '&:hover': {                                               // Hover effect
                  transform: 'scale(1.02)',                                // Slightly scale up
                  boxShadow: '0px 6px 30px rgba(0, 0, 0, 0.1)',            // Stronger shadow on hover
                  backgroundColor: pastelColors[index % pastelColors.length] // Maintain the same background color on hover
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {article.title}
                </Typography>

                {/* Add Date and Source with Icons */}
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
