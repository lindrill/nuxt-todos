<template>
    <div class="icon-picker">
        <div class="selected-icon-display" @click="togglePicker">
            <q-icon 
                v-if="modelValue" 
                :name="`fa-solid fa-${modelValue}`" 
                size="32px"
                class="selected-icon"
            />
            <span v-else class="placeholder text-white">Click to select icon</span>
            <q-icon name="fa-solid fa-chevron-down" size="24px" />
        </div>
        <q-dialog v-model="showPicker" position="standard">
            <q-card style="width: 600px; max-width: 90vw">
                <q-card-section class="q-pb-none">
                    <div class="text-h6">Select an Icon</div>
                    <q-input
                        v-model="searchQuery"
                        debounce="500"
                        outlined
                        placeholder="Search icons..."
                        color="amber-6"
                        class="q-mt-md"
                    >
                        <template v-slot:prepend>
                            <q-icon name="fa-solid fa-magnifying-glass" />
                        </template>
                    </q-input>
                </q-card-section>

                <q-card-section class="icon-grid-container">
                    <div class="icon-grid">
                        <div
                            v-for="icon in filteredIcons"
                            :key="icon+'category'"
                            class="icon-item"
                            :class="{ 'selected': modelValue === icon }"
                            @click="selectIcon(icon)"
                        >
                            <q-icon :name="`fa-solid fa-${icon}`" size="28px" />
                            <q-tooltip>{{ icon }}</q-tooltip>
                        </div>
                    </div>
                    <div v-if="filteredIcons.length === 0" class="no-results">
                        No icons found
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Clear" color="amber-6" text-color="black" @click="clearSelection"/>
                    <q-btn flat label="Close" color="amber-6" text-color="black" @click="showPicker = false"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const searchQuery = ref('')

const fontAwesomeIcons = [
    'house', 'star', 'heart', 'user', 'cart-shopping', 'calendar',
    'clock', 'book', 'wrench', 'code', 'gauge',
    'trash', 'check', 'calendar-days', 'compass', 'face-smile', 'trophy',
    'circle-question', 'circle-info', 'tag', 'globe', 'lightbulb', 'list',
    'lock', 'envelope', 'bell', 'user-circle', 'phone',
    'location-dot', 'print', 'magnifying-glass', 'gear', 'bag-shopping', 'thumbs-up',
    'arrow-trend-up', 'eye', 'triangle-exclamation', 'circle-plus',
    'arrow-right', 'paperclip', 'dollar-sign', 'camera', 'comment',
    'circle-check', 'cloud', 'pen', 'file-lines', 'pen-to-square',
    'at', 'folder', 'users', 'clock-rotate-left', 'inbox',
    'chart-line', 'keyboard', 'arrow-up-right-from-square', 'percent', 'map-pin',
    'bars', 'ellipsis-vertical', 'note-sticky', 'palette',
    'image', 'play', 'power-off', 'utensils', 'floppy-disk',
    'calendar-check', 'graduation-cap', 'paper-plane', 'share-nodes', 'gamepad',
    'store', 'calendar-day', 'chart-simple',
    'hourglass', 'wifi', 'cake-candles', 'champagne-glasses',
    'bowl-food', 'burger', 'dumbbell', 'plane', 'bed',
    'martini-glass', 'mug-saucer', 'hospital', 'book-open',
    'film', 'pills', 'pizza-slice', 'taxi', 'music',
    'tree', 'tree-city', 'spa', 'basketball',
    'umbrella-beach', 'dice', 'baby', 'golf-ball-tee',
    'hot-tub-person', 'kitchen-set', 'person-swimming', 'smoking', 'snowflake',
    'bus', 'briefcase', 'mug-hot', 'people-roof', 'bell-concierge',
    'infinity', 'restroom', 'wheelchair', 'baby-carriage', 'bath',
    'elevator', 'stairs', 'shop', 'building',
    'building-columns', 'city', 'gavel', 'landmark', 'chart-bar',
    'clipboard', 'cloud-arrow-up', 'bug',
    'gift', 'suitcase', 'chalkboard-user', 'car', 'right-left',
    'headset', 'copyright', 'credit-card', 'server',
    'leaf', 'euro-sign', 'puzzle-piece', 'wand-magic-sparkles', 'heart-circle-plus',
    'message', 'fingerprint', 'plane-departure', 'download', 'file-image',
    'circle-xmark', 'hourglass-start', 'lock-open', 'arrow-right-to-bracket',
    'droplet', 'square-arrow-up-right', 'hand', 'hands-bubbles', 'address-card', 'paw',
    'rectangle-ad', 'person-pregnant', 'microphone', 'cart-arrow-down',
    'circle-exclamation', 'trash-arrow-up', 'house-chimney', 'border-all', 'person-running',
    'volume-high', 'spell-check', 'star-half-stroke', 'align-left',
    'users-gear', 'user-tie', 'arrows-left-right', 'arrows-up-down', 'window-restore',
    'font', 'masks-theater', 'thumbs-down', 'ranking-star', 'timeline',
    'list-check', 'coins', 'hand-pointer', 'language',
    'bookmark', 'arrows-rotate', 'user-shield', 'table', 'table-cells',
    'table-list', 'table-columns', 'sun', 'bars-staggered', 'list-ul',
    'grip', 'grip-vertical', 'bars-progress', 'calendar-week', 'comments',
    'key', 'stopwatch', 'magnifying-glass-plus',
    'magnifying-glass-minus', 'plus', 'square-plus', 'delete-left', 'ban',
    'xmark', 'copy', 'scissors', 'paste', 'filter',
    'flag', 'share', 'registered', 'circle-dot',
    'link', 'arrow-down-short-wide', 'envelope-open', 'box-archive', 'calendar-plus',
    'flag-checkered', 'rotate-left', 'minus', 'minus-circle',
    'reply', 'reply-all', 'check-double',
    'arrow-down-a-z', 'text-height', 'box', 'rotate-right', 'water',
    'money-bill', 'money-bill-transfer', 'money-check-dollar', 'comment-dollar',
    'laptop', 'laptop-code', 'laptop-file', 'laptop-medical', 'house-laptop', 'windows',
    'mobile', 'mobile-screen', 'mobile-retro', 'android',
    'brush', 'paintbrush', 'broom', 'paint-roller', 'blender', 'toilet', 'trash-can'
]

const filteredIcons = computed(() => {
    if (!searchQuery.value) {
        return fontAwesomeIcons
    }
    const query = searchQuery.value.toLowerCase()
    const icons = fontAwesomeIcons.filter(icon => icon.includes(query))
    console.log('icons', icons)
    return icons
})

const togglePicker = () => {
    showPicker.value = !showPicker.value
}

const selectIcon = (icon) => {
    emit('update:modelValue', icon)
    showPicker.value = false
    searchQuery.value = ''
}

const clearSelection = () => {
    emit('update:modelValue', '')
    showPicker.value = false
    searchQuery.value = ''
}
</script>

<style scoped>
.icon-picker {
    width: 100%;
}

.selected-icon-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-radius: 10px !important;
    background-color: #1d2534 !important;
    border: 1px solid #28303f;
    cursor: pointer;
    transition: background-color 0.2s;
    min-height: 56px;
}

.selected-icon-display:hover {
    background-color: rgba(0, 0, 0, 0.08);
}

.selected-icon {
    color: #f59e0b;
}

.placeholder {
    color: rgba(0, 0, 0, 0.6);
    font-size: 16px;
}

.icon-grid-container {
    max-height: 400px;
    overflow-y: auto;
}

.icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 8px;
    padding: 8px 0;
}

.icon-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background-color: rgba(0, 0, 0, 0.02);
}

.icon-item:hover {
    background-color: rgba(245, 158, 11, 0.1);
    border-color: rgba(245, 158, 11, 0.3);
    transform: scale(1.05);
}

.icon-item.selected {
    background-color: rgba(245, 158, 11, 0.2);
    border-color: #f59e0b;
}

.no-results {
    text-align: center;
    padding: 40px;
    color: rgba(0, 0, 0, 0.6);
    font-size: 16px;
}
</style>