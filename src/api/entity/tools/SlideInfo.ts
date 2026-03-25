import {PPTGenerationInfoTypeEnum} from "../enums/PPTGenerationInfoTypeEnum.ts";

export type SlideInfo = {
    // ppt标题
    title: string;
    // PPT生成信息的类型，根据PPTGenerationInfoTypeEnum定义的
    type: PPTGenerationInfoTypeEnum;
    // 获取到项目Id
    projectId: string;
    // 当前信息的PPT页数
    current: number;
    // PPT的总页数
    total: number;
    // 消息
    message: number;
    // 某页PPT的数据信息
    slideData: any;
}
