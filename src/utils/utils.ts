export class PoLRYTubeItem {
    title: string;
    media_content_id: string;
    media_content_type: string;
    can_expand: boolean;
    can_play: boolean;
    thumbnail: string;
    children_media_class: string;
    media_class: string;
}

export const enum PoLRYTubeListState {
    CLEAR = 1,
    HAS_RESULTS = 2,
    LOADING = 4,
    NO_RESULTS = 8,
    ERROR = 16,
}

export const enum PoLRYTubeTab {
    CURRENTLY_PLAYING = 0,
    FOR_YOU = 1,
    SEARCH = 2,
    YOURS = 3,
}

export const PlayableMediaList = ["track", "playlist", "tv_show", "album"];

export const FetchableMediaContentType = [
    "vid_channel",
    "playlist",
    "track",
    "speakers",
    "music",
];

export const isNumeric = (num: any) =>
    (typeof num === "number" ||
        (typeof num === "string" && num.trim() !== "")) &&
    !isNaN(num as number);

export function areDeeplyEqual(obj1, obj2) {
    if (obj1 === obj2) return true;

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false;

        return obj1.every((elem, index) => {
            return areDeeplyEqual(elem, obj2[index]);
        });
    }

    if (
        typeof obj1 === "object" &&
        typeof obj2 === "object" &&
        obj1 !== null &&
        obj2 !== null
    ) {
        if (Array.isArray(obj1) || Array.isArray(obj2)) return false;

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (
            keys1.length !== keys2.length ||
            !keys1.every((key) => keys2.includes(key))
        )
            return false;

        for (let key in obj1) {
            let isEqual = areDeeplyEqual(obj1[key], obj2[key]);
            if (!isEqual) {
                //console.log(obj1[key], obj2[key]);
                return false;
            }
        }

        return true;
    }

    return false;
}
