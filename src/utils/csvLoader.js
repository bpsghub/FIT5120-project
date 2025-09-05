// CSV data loader utility
export class CSVLoader {
  static async loadTranslations() {
    try {
      // Add cache-busting parameter to force fresh data
      const timestamp = new Date().getTime()
      const response = await fetch(`/translations.csv?v=${timestamp}`)
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
            translationId: parseInt(values[0]),
            key: values[1],
            langCode: values[2],
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
      { translationId: 1, key: 'hello', langCode: 'en', text: 'Hello' },
      { translationId: 2, key: 'hello', langCode: 'zh', text: '你好' },
      { translationId: 3, key: 'hello', langCode: 'vi', text: 'Xin chào' },
      { translationId: 4, key: 'hello', langCode: 'id', text: 'Halo' },
      // ... more fallback data
    ]
  }
}
