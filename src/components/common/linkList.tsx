export const LinkListDetail = {
    "/": {
        href: '/',
        title: 'LinkHomeTitle',
        description: 'LinkHomeDescription',
        className: '/'
    },
    "/404": {
        href: '/404',
        title: 'Link404Title',
        description: 'Link404Description',
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
