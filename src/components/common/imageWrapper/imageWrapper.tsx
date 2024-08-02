import Image from 'next/image';

interface ImageWrapperProps {
    useRef?: any;
    loader?: any;
    id?: any;
    className?: any;
    src?: any;
    width?: number;
    height?: number;
    fill?: boolean;
    sizes?: any;
    quality?: number;
    priority?: boolean;
    alt?: string;
    style?: any;
    draggable?: boolean;
    onLoad?: any;
    onClick?: any;
    loading?: any;
    placeholder?: any;
    blurDataURL?: any;
}
export default function ImageWrapper(props: ImageWrapperProps) {
    const {
        useRef = null,
        loader = null,
        id = null,
        className = null,
        src = null,
        width = 100,
        height = 100,
        fill = false,
        sizes = null,
        quality = 85,
        priority = false,
        alt = '',
        style = {},
        draggable = false,
        onLoad = () => { },
        onClick = null,
        placeholder = 'empty',
        blurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNkqGfAAIxDWRAAOIQFAap6xDkAAAAASUVORK5CYII=',
    } = props;
    if (fill) {
        return (
            <Image
                ref={useRef}
                loader={loader}
                id={id}
                className={className}
                src={src}
                fill={fill}
                sizes={sizes}
                quality={quality}
                priority={priority}
                alt={alt}
                style={style}
                draggable={draggable}
                onLoad={onLoad}
                onClick={onClick}
                placeholder={placeholder}
                blurDataURL={blurDataURL}
            />
        );
    }
    return (
        <Image
            ref={useRef}
            loader={loader}
            id={id}
            className={className}
            src={src}
            width={width}
            height={height}
            sizes={sizes}
            quality={quality}
            priority={priority}
            alt={alt}
            style={style}
            draggable={draggable}
            onLoad={onLoad}
            onClick={onClick}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
        />
    );
}
