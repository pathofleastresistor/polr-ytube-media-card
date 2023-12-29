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
