const Jimp = require('jimp');
const Tesseract = require('tesseract.js');
const path = require('path');

class TextImageEditor {
  /**
   * Extract text from an image using OCR
   * @param {string} imagePath - Path to the image file
   * @returns {Promise<Object>} Object containing extracted text and metadata
   */
  static async extractText(imagePath) {
    try {
      const {
        data: { text, lines, confidence }
      } = await Tesseract.recognize(imagePath, 'eng');

      const textBlocks = lines.map(line => ({
        text: line.text,
        confidence: line.confidence,
        bbox: line.bbox,
        x: line.bbox.x0,
        y: line.bbox.y0,
        width: line.bbox.x1 - line.bbox.x0,
        height: line.bbox.y1 - line.bbox.y0
      }));

      return {
        success: true,
        fullText: text,
        blocks: textBlocks,
        overallConfidence: confidence,
        blockCount: textBlocks.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Add text to an image
   * @param {string} imagePath - Path to the image file
   * @param {string} textToAdd - Text to add to the image
   * @param {Object} options - Options object
   * @param {number} options.x - X coordinate
   * @param {number} options.y - Y coordinate
   * @param {number} options.fontSize - Font size (default: 30)
   * @param {string} options.color - Text color in hex (default: '#000000')
   * @param {number} options.maxWidth - Maximum text width (optional)
   * @returns {Promise<Buffer>} Modified image buffer
   */
  static async addText(imagePath, textToAdd, options = {}) {
    try {
      const {
        x = 50,
        y = 50,
        fontSize = 30,
        color = '#000000',
        maxWidth = null
      } = options;

      let image = await Jimp.read(imagePath);
      
      // Load default font
      const font = await Jimp.loadFont(Jimp.FONT_SIZE_32);

      // Convert hex color to Jimp color format
      const textColor = Jimp.cssColorToHex(color);

      // Print text on image
      image = image.print({
        font: font,
        x: x,
        y: y,
        text: textToAdd,
        maxWidth: maxWidth,
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_TOP
      }, textColor);

      const buffer = await image.getBuffer('image/png');
      return {
        success: true,
        buffer: buffer,
        message: `Text "${textToAdd}" added successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Edit existing text in an image (find and replace)
   * @param {string} imagePath - Path to the image file
   * @param {string} findText - Text to find
   * @param {string} replaceText - Text to replace with
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Modified image buffer and metadata
   */
  static async editText(imagePath, findText, replaceText, options = {}) {
    try {
      // First extract text to find locations
      const extracted = await this.extractText(imagePath);
      
      if (!extracted.success) {
        return {
          success: false,
          error: 'Failed to extract text from image'
        };
      }

      // Find matching text blocks
      const matchingBlocks = extracted.blocks.filter(block =>
        block.text.toLowerCase().includes(findText.toLowerCase())
      );

      if (matchingBlocks.length === 0) {
        return {
          success: false,
          error: `Text "${findText}" not found in image`,
          blocksSearched: extracted.blockCount
        };
      }

      let image = await Jimp.read(imagePath);
      const {
        fontSize = 30,
        color = '#000000',
        backgroundColor = '#FFFFFF'
      } = options;

      const font = await Jimp.loadFont(Jimp.FONT_SIZE_32);
      const bgColor = Jimp.cssColorToHex(backgroundColor);
      const textColor = Jimp.cssColorToHex(color);

      // Replace each matching block
      for (const block of matchingBlocks) {
        // Cover old text with background color
        image = image.blit(
          new Jimp(block.width + 20, block.height + 10, bgColor),
          block.x - 10,
          block.y - 5
        );

        // Add replacement text
        image = image.print({
          font: font,
          x: block.x,
          y: block.y,
          text: replaceText,
          maxWidth: block.width + 20
        }, textColor);
      }

      const buffer = await image.getBuffer('image/png');
      return {
        success: true,
        buffer: buffer,
        replacements: matchingBlocks.length,
        message: `Replaced ${matchingBlocks.length} instance(s) of "${findText}" with "${replaceText}"`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get image dimensions
   * @param {string} imagePath - Path to the image file
   * @returns {Promise<Object>} Image dimensions
   */
  static async getImageInfo(imagePath) {
    try {
      const image = await Jimp.read(imagePath);
      return {
        success: true,
        width: image.width,
        height: image.height,
        size: image.bitmap.data.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = TextImageEditor;
