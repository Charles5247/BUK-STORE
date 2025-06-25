import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Container } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { colors } from '../theme';
import { faqs } from '../data/faqData';

const FAQ = () => (
  <Box sx={{ background: colors.background, minHeight: '100vh', py: 6 }}>
    <Container maxWidth="md">
      <Typography variant="h3" sx={{ fontWeight: 'bold', color: colors.primary, mb: 4, textAlign: 'center' }}>
        Frequently Asked Questions
      </Typography>
      {faqs.map((faq, idx) => (
        <Accordion key={idx} sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ color: colors.primary }}>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ color: colors.text }}>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  </Box>
);

export default FAQ; 