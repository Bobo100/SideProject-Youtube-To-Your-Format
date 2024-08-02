export const LinkListDetail = {
    "/": {
        href: '/',
        title: '首頁',
        description: '首頁',
        className: '/'
    },
    "/404": {
        href: '/404',
        title: '404',
        description: '404',
        className: '/404'
    }
}


export const LinkList = [
    {
        href: LinkListDetail["/"].href,
        name: LinkListDetail["/"].title,
        className: LinkListDetail["/"].className,
        description: LinkListDetail["/"].description
    },
]
