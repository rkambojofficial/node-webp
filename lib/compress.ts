import { execute, getCommand, getOutputFilepath } from "./util";

interface ResizeOptions {
    width: number;
    height: number;
}

interface CropOptions {
    xPosition: number;
    yPosition: number;
    width: number;
    height: number;
}

interface LosslessOptions {
    /**
     * Lossless compression mode with the specified level between 0 and 9, with level 0 being the fastest, 9 being the slowest. Fast mode produces larger file size than slower ones. A good default is 6. This option is actually a shortcut for some predefined settings for quality and compressionLevel. If options quality or compressionLevel are subsequently used, they will invalidate the effect of this option.
     */
    level?: number;
    /**
     * For images with fully transparent area, the invisible pixel values (R/G/B or Y/U/V) will be preserved.
     * @default false
     */
    preserveTransparency?: boolean;
}

interface CompressOptions {
    /**
     * Specify the compression factor for RGB channels between 0 and 100.
     * @default 75
     */
    quality?: number;
    /**
     * Resize the source to a rectangle with size `width` x `height`. If either (but not both) of the width or height is 0, the value will be calculated preserving the aspect-ratio.
     * @property width {number}
     * @property `height`
     */
    resize?: ResizeOptions;
    /**
     * Crop the source to a rectangle with top-left corner at coordinates (`xPosition`, `yPosition`) and size `width` x `height`. This cropping area must be fully contained within the source rectangle.
     * @field `xPosition`
     * @field `yPosition`
     * @field `width`
     * @field `height`
     */
    crop?: CropOptions;
    /**
     * Encode the image without any loss.
     * @field `level`
     * @field `preserveTransparency`
     */
    lossless?: LosslessOptions;
    /**
     * Specify the level of near-lossless image preprocessing. This option adjusts pixel values to help compressibility, but has minimal impact on the visual quality. It triggers lossless compression mode automatically. The range is 0 (maximum preprocessing) to 100 (no preprocessing, the default). The typical value is around 60. Note that lossy with quality 100 can at times yield better results.
     */
    nearLossless?: number;
    /**
     * Specify the compression factor for alpha compression between 0 and 100. Lossless compression of alpha is achieved using a value of 100, while the lower values result in a lossy compression.
     * @default 100
     */
    alphaQuality?: number;
    /**
     * Specify a set of pre-defined parameters to suit a particular type of source material.
     */
    preset?: "default" | "photo" | "picture" | "drawing" | "icon" | "text";
    /**
     * This parameter controls the trade off between encoding speed and the compressed file size and quality. Possible values range from 0 to 6. When higher values are used, the encoder will spend more time inspecting additional encoding possibilities and decide on the quality gain. Lower value can result in faster processing time at the expense of larger file size and lower compression quality.
     * @default 4
     */
    compressionLevel?: number;
    /**
     * Use multi-threading for encoding, if possible.
     * @default false
     */
    multiThreaded?: boolean;
    /**
     * Reduce memory usage of lossy encoding by saving four times the compressed size (typically). This will make the encoding slower and the output slightly different in size and distortion. This flag is only effective for compressionLevel 3 and up.
     * @default false
     */
    lowMemory?: boolean;
}

/**
 * Compresses an image using the WebP format. Input format can be either PNG, JPEG, TIFF, WebP or raw Y'CbCr samples.
 * @param imageFilepath Path for the input image file.
 * @param options Additional options for compression.
 */
async function compress(imageFilepath: string, options?: CompressOptions) {
    const command = getCommand("cwebp");
    const outputFilepath = getOutputFilepath(imageFilepath);
    const args = [
        imageFilepath,
        "-o",
        outputFilepath
    ];
    if (options) {
        const { quality, resize, crop, lossless, nearLossless, alphaQuality, preset, compressionLevel, multiThreaded, lowMemory } = options;
        if (quality) {
            args.push(`-q ${quality}`);
        }
        if (resize) {
            args.push(`-resize ${resize.width} ${resize.height}`);
        }
        if (crop) {
            args.push(`-crop ${crop.xPosition} ${crop.yPosition} ${crop.width} ${crop.height}`);
        }
        if (lossless) {
            if (lossless.level) {
                args.push(`-z ${lossless.level}`);
            } else {
                args.push("-lossless");
                if (lossless.preserveTransparency) {
                    args.push("-exact");
                }
            }
        }
        if (nearLossless) {
            args.push(`-near_lossless ${nearLossless}`);
        }
        if (alphaQuality) {
            args.push(`-alpha_q ${alphaQuality}`);
        }
        if (preset) {
            args.push(`-preset ${preset}`);
        }
        if (compressionLevel) {
            args.push(`-m ${compressionLevel}`);
        }
        if (multiThreaded) {
            args.push("-mt");
        }
        if (lowMemory) {
            args.push("-low_memory");
        }
    }
    const { stderr } = await execute(command, args, {
        shell: true
    });
    return {
        log: stderr,
        outputFilepath
    };
}

export default compress;