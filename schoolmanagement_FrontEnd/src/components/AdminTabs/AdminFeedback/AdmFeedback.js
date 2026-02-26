import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Card,
  CardContent,
  Typography,
  DialogContentText,
} from "@mui/material";

const AdmFeedbacks= () => {
  const [openViewMessage, setOpenViewMessage] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [openAnswer, setOpenAnswer] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [answerMessages, setAnswerMessages] = useState([]);
  const [viewMessage, setViewMessage] = useState("");

  const handleViewMessageClick = () => {
    setOpenViewMessage(true);
    setViewMessage(`     India has a rich and diverse history that spans thousands of years, marked by numerous dynasties, empires, and cultural developments. Here's a brief overview of key periods in Indian history:

    1. **Indus Valley Civilization (c. 3300–1300 BCE):**
       - One of the world's oldest civilizations.
       - Advanced urban centers like Harappa and Mohenjo-Daro.
       - Sophisticated drainage and sewage systems.

    2. **Vedic Period (c. 1500–500 BCE):**
       - Rigveda, the oldest of the Vedas, composed.
       - Vedic texts and hymns shaped early Hinduism.

    3. **Maurya Empire (c. 322–185 BCE):**
       - Chandragupta Maurya founded the empire.
       - Ashoka, the famous emperor, embraced Buddhism and spread its teachings.

    4. **Gupta Empire (c. 320–550 CE):**
       - Considered the "Golden Age" of India.
       - Advances in science, mathematics, astronomy, and art.

    5. **Medieval Period (c. 700–1700 CE):**
       - Arab and Turkish invasions.
       - Delhi Sultanate established (1206).
       - Mughal Empire (1526–1857) with notable rulers like Akbar, Shah Jahan, and Aurangzeb.

    6. **Bhakti and Sufi Movements (c. 8th–18th centuries):**
       - Rise of devotional movements in Hinduism (Bhakti) and Islam (Sufi).
       - Emphasis on personal connection with the divine.

    7. **Vijayanagara and Bahmani Kingdoms (c. 1336–1646):**
       - Flourishing empires in the Deccan region.
       - Significant cultural and architectural developments.

    8. **Colonial Era (17th–20th centuries):**
       - Arrival of European powers, including the British, Portuguese, and Dutch.
       - British East India Company gained control.
       - Indian Rebellion of 1857 against British rule.

    9. **Indian Independence Movement (20th century):**
       - Led by Mahatma Gandhi, Jawaharlal Nehru, and others.
       - Independence achieved on August 15, 1947.
       - Partition of India and creation of Pakistan.

    10. **Post-Independence (1947–present):**
        - Formation of the Republic of India.
        - Economic reforms in 1991 liberalized the economy.
        - India emerged as a major global player in technology, science, and commerce.

    This overview captures only a fraction of India's rich and complex history. The country's history is characterized by a continuous interplay of various cultures, religions, and political entities, contributing to its vibrant and diverse heritage.`);
  };

  const handleReplyClick = () => {
    setOpenReply(true);
  };

  const handleSendReply = () => {
    // Check if replyMessage is not empty before sending
    if (replyMessage.trim() !== "") {
      const messageId = Date.now();
      const newReply = {
        id: messageId,
        originalMessage: viewMessage,
        replyMessage: replyMessage,
      };

      setAnswerMessages((prevMessages) => [...prevMessages, newReply]);
      setReplyMessage("");
      setOpenReply(false);
    } else {
      // Handle the case when the reply is empty
      alert("Please enter a reply before sending.");
    }
  };

  const handleAnswerClick = () => {
    setOpenAnswer(true);
  };

  const handleCloseDialogs = () => {
    setOpenViewMessage(false);
    setOpenReply(false);
    setOpenAnswer(false);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Typography
          variant="h6"
          component="h6"
          sx={{ textAlign: "center", fontWeight: 700 }}
        >
          Feedback
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Answer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Subham</TableCell>
              <TableCell>Regarding Project</TableCell>
              <TableCell>
                <Button onClick={handleViewMessageClick}>View Message</Button>
              </TableCell>
              <TableCell>
                <Button onClick={handleReplyClick}>Reply</Button>
              </TableCell>
              <TableCell>
                <Button onClick={handleAnswerClick}>Answer</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Message Popup */}
      <Dialog open={openViewMessage} onClose={handleCloseDialogs}>
        <DialogTitle>View Message</DialogTitle>
        <DialogContent>
          <Card>
            <CardContent>
              <Typography component="pre">{viewMessage}</Typography>
            </CardContent>
          </Card>
          <Button onClick={handleCloseDialogs}>Close</Button>
        </DialogContent>
      </Dialog>

      {/* Reply Popup */}
      <Dialog open={openReply} onClose={handleCloseDialogs}>
        <DialogTitle>Reply</DialogTitle>
        <DialogContent>
          <Card>
            <CardContent>
              <Typography component="pre">{viewMessage}</Typography>
              <TextField
                label="Type your reply"
                multiline
                rows={4}
                fullWidth
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
              <Button onClick={handleSendReply}>Send</Button>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Answer Popup */}
      <Dialog open={openAnswer} onClose={handleCloseDialogs}>
        <DialogTitle>Answer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {answerMessages.map((reply) => (
              <Card key={reply.id} style={{ marginBottom: "10px" }}>
                <CardContent>
                  <Typography component="pre">
                    {reply.originalMessage}
                  </Typography>
                  <hr />
                  <Typography component="pre">
                    <span style={{ color: "blue" }}>Reply:</span>{" "}
                    {reply.replyMessage}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            <Button onClick={handleCloseDialogs}>Close</Button>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdmFeedbacks;
