// CSV data loader utility
export class CSVLoader {
  static async loadTranslations() {
    try {
      const response = await fetch('/translations.csv')
      const csvText = await response.text()

      // Parse CSV manually (simple parser for our specific format)
      const lines = csvText.split('\n')
      const headers = lines[0].split(',')

      const translations = []

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        // Handle CSV parsing with potential commas in quoted text
        const values = this.parseCSVLine(line)

        if (values.length >= 4) {
          translations.push({
            translation_id: parseInt(values[0]),
            key: values[1],
            lang_code: values[2],
            text: values[3],
          })
        }
      }

      return translations
    } catch (error) {
      console.error('Error loading translations CSV:', error)
      // Return fallback data if CSV loading fails
      return this.getFallbackTranslations()
    }
  }

  static parseCSVLine(line) {
    const values = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }

    values.push(current.trim())
    return values
  }

  static getFallbackTranslations() {
    // Fallback data in case CSV loading fails
    return [
      { translation_id: 1, key: 'hello', lang_code: 'en', text: 'Hello' },
      { translation_id: 2, key: 'hello', lang_code: 'zh', text: '你好' },
      { translation_id: 3, key: 'hello', lang_code: 'vi', text: 'Xin chào' },
      { translation_id: 4, key: 'hello', lang_code: 'id', text: 'Halo' },
      // ... more fallback data
    ]
  }
}
