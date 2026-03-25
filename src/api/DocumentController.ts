import {BasicRequest} from "./BasicRequest.ts";

const basicRequest = BasicRequest();
const documentPath = "/document";
export class DocumentController {

    /**
     * 获取docx文档文件下载路径
     * @param chatSessionId
     * @param filePath
     */
    public static getDownloadUrl = async (chatSessionId: string, filePath: string) => {
        try {
            const formData = new FormData();
            formData.append('chatSessionId', chatSessionId);
            formData.append('filePath', filePath);
            const response = await basicRequest.post(documentPath + "/download-url", formData);

            const res = response.data;
            if (res.code !== 0) {
                console.error("docx文档下载路径获取失败");
                return "";
            }

            return res.data;
        } catch (error) {
            console.error('请求获取docx文档文件下载路径失败:', error);
            return "";
        }
    }
}
