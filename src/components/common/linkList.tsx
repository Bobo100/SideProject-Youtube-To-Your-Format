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
    },
    "convertTool": {
        href: '/convertTool',
        title: 'LinkConvertToolTitle',
        description: 'LinkConvertToolDescription',
        className: '/convertTool'
    },
}


export const LinkList = [
    {
        href: LinkListDetail["/"].href,
        name: LinkListDetail["/"].title,
        className: LinkListDetail["/"].className,
        description: LinkListDetail["/"].description
    },
    {
        href: LinkListDetail["convertTool"].href,
        name: LinkListDetail["convertTool"].title,
        className: LinkListDetail["convertTool"].className,
        description: LinkListDetail["convertTool"].description
    },
]
