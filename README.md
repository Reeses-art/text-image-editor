# 🖼️ Text Image Editor

A powerful AI-powered web application for extracting, adding, and editing text in images using OCR (Optical Character Recognition) technology.

## ✨ Features

- **🔍 Extract Text** - Automatically extract all text from images using Tesseract OCR
- **✏️ Add Text** - Add new text to images at specific coordinates
- **✂️ Edit Text** - Find and replace existing text in images
- **ℹ️ Image Info** - Get detailed information about image dimensions and size
- **🎨 Beautiful UI** - Modern, responsive web interface
- **⚡ Fast Processing** - Efficient OCR and image manipulation
- **📱 Mobile Friendly** - Works seamlessly on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Reeses-art/text-image-editor.git
cd text-image-editor
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## 📖 Usage

### Extract Text from Image
1. Click on the "Extract Text" card
2. Upload an image file
3. Click "Extract Text"
4. View the extracted text and confidence scores

### Add Text to Image
1. Click on the "Add Text" card
2. Upload an image
3. Enter the text you want to add
4. Set the position (X, Y coordinates)
5. Choose text color
6. Click "Add Text to Image"
7. Download the result

### Edit Text in Image
1. Click on the "Edit Text" card
2. Upload an image
3. Enter the text to find
4. Enter the replacement text
5. Set text and background colors
6. Click "Replace Text"
7. Download the modified image

### Get Image Information
1. Click on the "Image Info" card
2. Upload an image
3. Click "Get Image Info"
4. View image dimensions and size details

## 🔧 API Endpoints

All endpoints accept multipart/form-data with an image file.

### POST /api/extract
Extract text from an image.

**Request:**
- `image` (file) - Image file to extract text from

**Response:**
```json
{
  "success": true,
  "fullText": "extracted text...",
  "blocks": [...],
  "blockCount": 5,
  "overallConfidence": 0.95
}
```

### POST /api/add-text
Add text to an image.

**Request:**
- `image` (file) - Image file
- `text` (string) - Text to add
- `x` (number) - X coordinate (default: 50)
- `y` (number) - Y coordinate (default: 50)
- `color` (string) - Text color in hex format (default: #000000)

**Response:** Modified image as PNG

### POST /api/edit-text
Find and replace text in an image.

**Request:**
- `image` (file) - Image file
- `findText` (string) - Text to find
- `replaceText` (string) - Replacement text
- `color` (string) - Text color in hex format (default: #000000)
- `backgroundColor` (string) - Background color in hex format (default: #FFFFFF)

**Response:** Modified image as PNG

### POST /api/image-info
Get information about an image.

**Request:**
- `image` (file) - Image file

**Response:**
```json
{
  "success": true,
  "width": 1920,
  "height": 1080,
  "size": 2097152
}
```

## 📦 Dependencies

- **express** - Web framework
- **multer** - File upload handling
- **jimp** - Image processing
- **tesseract.js** - OCR engine
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🎯 Use Cases

- 📄 Certificate generation and customization
- 📝 Document text extraction
- 🎫 Ticket or badge creation
- 📸 Image annotation
- 🏷️ Label generation
- 📋 Form filling automation

## 🔒 Security

- Uploaded files are temporarily stored and automatically deleted after processing
- File type validation (only image formats allowed)
- Input validation for all parameters
- CORS enabled for cross-origin requests

## 🛠️ Development

For development with auto-restart on file changes:

```bash
npm run dev
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📧 Support

For questions or issues, please open a GitHub issue.

---

**Happy Text Editing! 🎉**
