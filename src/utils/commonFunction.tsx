export const getThemeClassName = (className: string, styles: any, theme?: string) => {
    const themeSuffix = theme === 'light' ? '_light' : '_dark';
    return styles[className + themeSuffix];
};

export function scrollToAnchor(id: string, offset: number) {
    const element = document.getElementById(id);
    if (element) {
        const offsetPosition = element.offsetTop - offset - 20;
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}