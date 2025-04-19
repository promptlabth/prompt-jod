import { GoogleGenerativeAI, Part } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

interface ChatResponse {
  text: string;
  isReminder: boolean;
  reminderData?: {
    title: string;
    description: string;
    dateTime: string;
    day: string;
  };
}

// Language-specific prompts
const prompts = {
  th: `คุณเป็นผู้ช่วย AI ที่มีประโยชน์ คุณต้องตอบเป็นภาษาไทยเท่านั้น
  ถ้าผู้ใช้ส่งข้อความมาเป็นภาษาอื่น ให้แปลเป็นภาษาไทยและตอบเป็นภาษาไทย
  
  ถ้าคุณพบว่าข้อความของผู้ใช้มีเรื่องการเตือนความจำหรืองานที่ต้องทำในเวลาหรือวันที่เฉพาะเจาะจง
  ให้ตอบในรูปแบบ JSON ที่มี:
  - "text": ข้อความตอบกลับปกติให้ผู้ใช้ (ตอบกลับเฉพาะข้อความเท่านั้น ไม่ต้องแสดงโครงสร้าง JSON)
  - "isReminder": true
  - "reminderData": ข้อมูลการเตือนความจำในรูปแบบ JSON ที่มี:
    - "title": หัวข้อการเตือน
    - "description": รายละเอียดการเตือน
    - "dateTime": เวลาในรูปแบบ "HH:mm" (เช่น "18:00")
    - "day": วัน (เช่น "พรุ่งนี้", "วันนี้", "มะรืนนี้")
  
  ตัวอย่างการตอบสำหรับการเตือนความจำ:
  {
    "text": "เข้าใจแล้วครับ ผมจะช่วยตั้งการเตือนให้คุณ",
    "isReminder": true,
    "reminderData": {
      "title": "นัดกับแม่",
      "description": "นัดกับแม่พรุ่งนี้เวลา 18:00 น.",
      "dateTime": "18:00",
      "day": "พรุ่งนี้"
    }
  }
  
  ตัวอย่างการตอบสำหรับการสนทนาปกติ:
  {
    "text": "เข้าใจแล้วครับ ผมจะช่วยคุณในเรื่องนั้น",
    "isReminder": false
  }

  หมายเหตุสำคัญ: 
  1. ข้อความใน "text" ต้องเป็นข้อความปกติเท่านั้น ไม่ต้องแสดงโครงสร้าง JSON
  2. ข้อมูลทั้งหมดจะถูกส่งในรูปแบบ JSON อยู่แล้ว ไม่ต้องแสดงโครงสร้าง JSON ในข้อความตอบกลับ`,
  
  en: `You are a helpful AI assistant. You must respond in English only.
  If the user's message is in a different language, translate it to English and respond in English.
  
  If you detect that the user's message contains a reminder or task to be done at a specific time or date, 
  respond with JSON format containing:
  - "text": Normal response message to the user (return only the message text, do not show JSON structure)
  - "isReminder": true
  - "reminderData": Reminder data in JSON format with:
    - "title": Reminder title
    - "description": Reminder description
    - "dateTime": Time in "HH:mm" format (e.g., "18:00")
    - "day": Day (e.g., "tomorrow", "today", "day after tomorrow")
  
  Example response for reminder:
  {
    "text": "I'll help you set a reminder",
    "isReminder": true,
    "reminderData": {
      "title": "Meeting with Mom",
      "description": "Meeting with mom tomorrow at 6 PM",
      "dateTime": "18:00",
      "day": "tomorrow"
    }
  }
  
  Example response for normal chat:
  {
    "text": "I understand. Let me help you with that question.",
    "isReminder": false
  }

  Important notes:
  1. The "text" field should contain only the normal message text, do not show JSON structure
  2. All data will be sent in JSON format automatically, do not show JSON structure in the response message`
};

export async function chatWithGemini(message: string, language: string = 'en'): Promise<ChatResponse> {
  try {
    // Initialize the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
    
    // Get the appropriate prompt based on language
    const systemPrompt = language === 'th' ? prompts.th : prompts.en;
    console.log('Selected language:', language);
    console.log('Using prompt:', systemPrompt);
    
    // Start the chat with language-specific instruction
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: language === 'th' ? 'คุณต้องตอบเป็นภาษาไทยเท่านั้น คุณเข้าใจไหม?' : 'You must respond in English only. Do you understand?' }] as Part[],
        },
        {
          role: "model",
          parts: [{ text: language === 'th' ? 'เข้าใจแล้วครับ ผมจะตอบเป็นภาษาไทยเท่านั้น' : 'Yes, I understand. I will respond in English only.' }] as Part[],
        },
        {
          role: "user",
          parts: [{ text: systemPrompt }] as Part[],
        },
        {
          role: "model",
          parts: [{ text: language === 'th' ? 'เข้าใจแล้วครับ ผมจะประมวลผลข้อความและตรวจจับการเตือนความจำ ตอบเป็นภาษาไทยในรูปแบบ JSON ที่กำหนด' : 'I understand. I will process messages and detect reminders, responding in English in the specified JSON format.' }] as Part[],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // Send the message and get response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const responseText = response.text();

    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const jsonResponse = JSON.parse(jsonMatch[0]);
        return {
          text: jsonResponse.text,
          isReminder: jsonResponse.isReminder,
          reminderData: jsonResponse.reminderData
        };
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }

    // If no JSON found or parsing failed, return as normal message
    return {
      text: responseText,
      isReminder: false
    };
  } catch (error) {
    console.error('Error in Gemini chat:', error);
    return {
      text: language === 'th' ? 'ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองอีกครั้ง' : "I apologize, but I encountered an error. Please try again.",
      isReminder: false
    };
  }
} 