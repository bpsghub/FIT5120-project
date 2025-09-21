<template>
  <div class="mp-list">
    <div v-for="item in items" :key="item.key" class="mp-item">
      <div class="mp-title">{{ itemTitle(item.key) }}</div>
      <div class="mp-desc">{{ item.text }}</div>
    </div>
  </div>
</template>

<script>
import csvUrl from '/Learning about Australia/meetingPeople.csv?url&raw';

async function fetchCSV(url) {
  const res = await fetch(url);
  return await res.text();
}

function parseCSV(csv, lang) {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(',');
  const langIdx = headers.findIndex(h => h.trim().toLowerCase() === lang.toLowerCase());
  const keyIdx = headers.indexOf('key');
  const items = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
    items.push({
      key: cols[keyIdx].replace(/"/g, ''),
      text: cols[langIdx].replace(/^"|"$/g, '')
    });
  }
  return items;
}

export default {
  name: 'MeetingPeopleContent',
  props: {
    lang: {
      type: String,
      default: 'en',
    },
  },
  data() {
    return {
      items: [],
    };
  },
  watch: {
    lang: {
      immediate: true,
      async handler(newLang) {
        const csv = await fetchCSV(csvUrl);
        this.items = parseCSV(csv, newLang);
      },
    },
  },
  methods: {
    itemTitle(key) {
      switch (key) {
        case 'smile': return 'Smile';
        case 'handshake': return 'Handshake';
        case 'smalltalk': return 'Small Talk';
        case 'respect': return 'Respect Personal Space';
        case 'introduce': return 'Introduce Yourself';
        default: return key;
      }
    },
  },
  async mounted() {
    const csv = await fetchCSV(csvUrl);
    this.items = parseCSV(csv, this.lang);
  },
};
</script>

<style scoped>
.mp-list {
  width: 100%;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.mp-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 24px 32px;
}

.mp-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #4b4b4b;
}

.mp-desc {
  font-size: 1.05rem;
  color: #222;
}
</style>
