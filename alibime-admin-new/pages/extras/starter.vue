<script>
/**
 * Starter component
 */
export default {
    head() {
        return {
            title: `داشبورد - ${this.title} | علی بیمه`
        }
    },
    data() {
        return {
            title: 'Starter',
            items: [{
                    text: 'alibime',
                    href: '/',
                },
                {
                    text: 'Pages',
                    href: '/',
                },
                {
                    text: 'Starter',
                    active: true,
                },
            ],
        }
    },
    middleware: ["check-auth", "auth"]
}
</script>

<template>
<div>
    <PageHeader :title="title" :items="items" />
</div>
</template>
