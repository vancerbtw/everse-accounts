module.exports = {
    plugins: [
        "postcss-import",
        "tailwindcss",
        "autoprefixer",
        [
            "@fullhuman/postcss-purgecss",
            {
                content: [
                    "./pages/**/*.tsx",
                    "./components/**/*.tsx"
                ],
                defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
            }
        ]
    ],
};
