<template>
    <div class="folder">
        <span>📂 {{ name }}</span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: this.folder.name,
            isDir: this.folder.isDir,
        }
    },
    name: 'FolderComponent',
    props: {
        folder: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped></style>