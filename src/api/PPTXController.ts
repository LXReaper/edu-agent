import {BasicRequest} from "./BasicRequest.ts";

const basicRequest = BasicRequest();
const pptxPath = "/pptx";
export class PPTXController {
    /**
     * 获取某个PPT生成项目中的每页PPT数据
     * @param projectId
     */
    public static getSlideDataByProjectId = async (projectId: string) => {
        try {
            const formData = new FormData();
            formData.append('projectId', projectId);
            const response = await basicRequest.post(pptxPath + "/slide_data/get", formData)
            return response.data;
        } catch (error) {
            console.error('请求获取某个PPT生成项目中的每页PPT数据失败:', error);
            return [];
        }
    }
}
