import {SearchReport} from "./reports/searchReport.tsx";
import {SummaryReport} from "./reports/summaryReport.tsx";
import type {Reference} from "../../../../../api/entity/tools/BaiduAISearchResponse.ts";
import React, {useEffect, useState} from "react";

interface StepsContainerProps {
    len: string;
}

export const StepsContainer: React.FC<StepsContainerProps> = ({
}) => {
    const searchResults = [
            {
                "id": 1,
                "title": "刘禹锡《陋室铭》解析",
                "url": "http://mbd.baidu.com/newspage/data/dtlandingsuper?nid=dt_5300056267735276362",
                "webAnchor": "",
                "icon": "https://psstatic.cdn.bcebos.com/video/wiseindex/aa6eef91f8b5b1a33b454c401_1660835115000.png",
                "content": "",
                "date": "2024-12-27 00:50:28",
                "type": "image",
                "image": {
                    "url": "http://miaobi-lite.bj.bcebos.com/miaobi/5mao/b%276ZmL5a6k6ZOt55qE5a%2BT5oSP5ZKM6YGT55CGXzE3MzUyMzE4MDguMjczMDI4%27/0.png",
                    "height": "1679",
                    "width": "1178"
                }
            },
            {
                "id": 2,
                "title": "刘禹锡《陋室铭》原文及翻译赏析",
                "url": "http://m.renrendoc.com/paper/278361552.html",
                "webAnchor": "",
                "icon": "https://m.renrendoc.com/favicon.ico",
                "content": "",
                "date": "2023-06-27 11:26:48",
                "type": "image",
                "image": {
                    "url": "http://file4.renrendoc.com/view/84611a039f69d9b5ecb6756c4ab4816f/84611a039f69d9b5ecb6756c4ab4816f1.gif",
                    "height": "1753",
                    "width": "1240"
                }
            },
            {
                "id": 3,
                "title": "最新刘禹锡《陋室铭》作者简介文言文译文注释",
                "url": "http://www.renrendoc.com/paper/215528584.html",
                "webAnchor": "",
                "icon": "https://m.renrendoc.com/favicon.ico",
                "content": "",
                "date": "2022-07-23 00:00:00",
                "type": "image",
                "image": {
                    "url": "http://file4.renrendoc.com/view/ee79c9e946413f7e2c0bd79be4a45d27/ee79c9e946413f7e2c0bd79be4a45d271.gif",
                    "height": "2818",
                    "width": "1991"
                }
            },
            {
                "id": 4,
                "title": "陋室铭翻译及原文注释",
                "url": "http://m.renrendoc.com/paper/279158216.html",
                "webAnchor": "",
                "icon": "https://m.renrendoc.com/favicon.ico",
                "content": "",
                "date": "2023-06-30 11:42:07",
                "type": "image",
                "image": {
                    "url": "http://file4.renrendoc.com/view/91af05a1881750b8d8a2c7e61183b326/91af05a1881750b8d8a2c7e61183b3261.gif",
                    "height": "2479",
                    "width": "1754"
                }
            },
            {
                "id": 5,
                "title": "《陋室铭》:写出这篇文章,是想告诉你我的人生志向",
                "url": "http://www.bilibili.com/video/BV1zZ421L7HS",
                "webAnchor": "",
                "icon": "https://b.bdstatic.com/searchbox/mappconsole/image/20181030/1540889038159862.png",
                "content": "当一名小小的通判。我尽可能不去听他们说的那些话。我也不愿意在县衙不用整天看那张脸，我还挺开心的，游山玩水，悠哉悠哉。",
                "date": "2024-08-27 19:19:37",
                "type": "video",
                "video": {
                    "url": "",
                    "height": "480",
                    "width": "852",
                    "size": "",
                    "duration": "626",
                    "hoverPic": "http://t15.baidu.com/it/u=235233014,4077644222&fm=225&app=113&f=JPEG?w=2048&h=1534&s=102A6AFBD064E7EDD285A22203007056"
                }
            },
            {
                "id": 6,
                "title": "中考文言文必备:《陋室铭》详解及朗读示范",
                "url": "http://haokan.baidu.com/v?pd=wisenatural&vid=9351309010463254031",
                "webAnchor": "",
                "icon": "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=76251347,1123177279&fm=195&app=88&f=PNG?w=200&h=200",
                "content": "刘禹锡与柳松元并称刘柳本诗通过对陋室的描写和赞颂抒发了作者安贫乐道。展现了不慕富贵。的高尚节操。就是让你重点的把这个名字解释出来。而且的药对它的含义要非常熟练。就成为灵异的水了。这的意思。陋室。这里指作者自己的屋子。心散布很远的香气。这里只德行美好。这是一间简陋的居室。",
                "date": "2021-05-24 07:42:01",
                "type": "video",
                "video": {
                    "url": "",
                    "height": "360",
                    "width": "640",
                    "size": "",
                    "duration": "414",
                    "hoverPic": "http://t13.baidu.com/it/u=9045895955086868895,1791634780513125139&fm=3008&app=3011&f=JPEG"
                }
            },
            {
                "id": 7,
                "title": "《陋室铭》深度解析:原文、译文、注释及赏析(完整版)",
                "url": "http://form.baidu.com/view/522be8391d2e453610661ed9ad51f01dc2815776.html",
                "webAnchor": "",
                "icon": "https://form.baidu.com/favicon.ico",
                "content": " 一、 作者简介与创作背景 刘禹锡(772年-842年),字梦得,河南洛阳人,唐代中晚期著名文学家、哲学家,有“诗豪”之称。他与柳宗元并称“刘柳”,与白居易并称“刘白”。刘禹锡为人刚直,曾积极参与王叔文领导的“永贞革新”。革新失败后,他屡遭贬谪,长期流放于边远州郡。 《陋室铭》一般认为创作于刘禹锡被贬至安徽和州(今和县)任刺史期间。据传,当地知县见他是被贬之官,故意刁难,安排他住在偏僻临江的简陋小屋。刘禹锡非但没有抱怨,反而欣然提笔,写下这篇《陋室铭》,并请人刻碑立于门前,以此明志,回击势利小人。此文正是其身处逆境而精神不屈、情操高洁的生动写照。 二、 《陋室铭》原文 山不在高,有仙则名。水不在深,有龙则灵。斯是陋室,惟吾德馨。苔痕上阶绿,草色入帘青。谈笑有鸿儒,往来无白丁。可以调素琴,阅金经。无丝竹之乱耳,无案牍之劳形。南阳诸葛庐,西蜀子云亭。孔子云:何陋之有? 三、 《陋室铭》现代汉语译文 山不在于有多高,有了仙人居住就会著名。水不在于有多深,有了蛟龙潜藏就显得有灵气。这虽然是一间简陋的屋舍,只因我的品德高尚(而显得芬芳)。蔓延到台阶上的青苔痕迹碧绿一片,芳草的青色映入竹帘,满目青翠。在这里谈笑往来的,都是学问渊博的大学者,没有浅薄无识的俗客。平日里可以弹奏不加装饰的古琴,潜心阅读泥金书写的佛经。没有世俗嘈杂的音乐扰乱双耳,没有官府繁杂的公文劳累身心。(它好比)南阳诸葛亮隐居的草庐,又像西蜀扬雄著述的玄亭。孔子说:“这有什么简陋的呢?”",
                "date": "2025-12-29 01:21:57",
                "type": "web"
            },
            {
                "id": 8,
                "title": "2022年中考文言文命题热点解读",
                "url": "https://baijiahao.baidu.com/s?id=1718166783195365808&wfr=spider&for=pc",
                "webAnchor": "",
                "icon": "https://baijiahao.baidu.com/favicon.ico",
                "content": " 一、《陋室铭》的主题思想 本文通过对居室情景的描绘,极力形容“陋室”不陋,表达了一种高洁傲岸的情操和安贫乐道的情趣。这一点希望广大考生一定要仔细背诵,因为此类型的题目最容易被考到。 二、语言特色 句式骈散结合,骈句为主,节奏明快,并运用托物言志、类比手法,描写、议论等表达方式,融为一体。 三、名句默写 1、短文开头用山水的平凡因仙、龙而出名作类比,引出了全文主旨句(斯是陋室,惟吾德馨)。 2、描写陋室自然环境清幽的句子是(苔痕上阶绿,草色入帘青)。 3、表现陋室主人与博学的友人谈笑风生的句子是(谈笑有鸿儒,往来无白丁)。 4、正面实写陋室主人生活情趣高雅的句子是(可以调素琴,阅金经)。 5、反面虚写陋室主人渴望远离世俗的句子是(无丝竹之乱耳,无案牍之劳形)。 6、以古代先贤自况强调陋室不陋的句子是(南阳诸葛庐,西蜀子云亭)。 四、核心问答题 1、《陋室铭》结尾引用孔子的话“何陋之有”,有什么深意?与同学交流一下,在物质生活日益丰富的今天,应该如何看待作者所说的“惟吾德馨”? 答案:“何陋之有”语出《论语·子罕》,原话是“君子居之,何陋之有。”这里作者引用孔子的话,以反问作结,更具有雄辩的力量,再一次证明“陋室不陋”,从而表明自己超凡脱俗的胸襟,并巧妙地回应了开头“惟吾德馨”一句。在物质生活日益丰富的今天,惟吾德馨仍然值得我们学习。《陋室铭》表现了这样一种思想:尽管居室简陋,但只要主人品德高尚,情趣高雅,就不会觉得简陋。在当今社会,我们更要追求高尚的品德和高雅的情趣。 2、“类比”是同类事物或有同种性质的事物之间的比较,本文两次用的类比手法,请结合内容具体分析。 答案:开头用“山不在高,有仙则名;水不在深,有龙则灵”类比“斯是陋室,惟吾德馨”,说明陋室也可借高尚之士散发芬芳,以类比的方式开头,引出“斯是陋室,惟吾德馨”的主旨,也为后面歌颂陋室埋下了伏笔。 3、简析“苔痕上阶绿,草色入帘青”中“上”“入”的好处 答案:二字对仗工整,化静为动,生动传神,突出了陋室环境的生机盎然,并流露出了作者的喜悦之情。",
                "date": "2021-12-04 06:45:32",
                "type": "web"
            },
            {
                "id": 9,
                "title": "作者借这篇“铭”赞美简陋的居室,抒发了如何的情怀?",
                "url": "https://easylearn.baidu.com/edu-page/tiangong/questiondetail?id=1831230955195869699&fr=search",
                "webAnchor": "",
                "icon": "https://mbs1.bdstatic.com/searchbox/mappconsole/image/20230906/3096e08a-869d-46a7-8d30-5e32adb66fdc.png",
                "content": " 1. 初步定位:“铭”特指刘禹锡《陋室铭》,文体特征为托物言志。2. 提取关键句:首句“斯是陋室,惟吾德馨”直接点明陋室因主人品德而美,暗示精神境界高于物质条件。3. 分析环境描写:苔痕、草色等意象塑造幽雅环境,体现主人隐逸自守、淡泊名利的态度。4. 解读人物关系:“谈笑有鸿儒”体现对知识追求的坚持,“往来无白丁”暗含拒绝庸俗社交的高洁情操。5. 对比手法:通过类比诸葛庐、子云亭,暗示自己具有与先贤相似的政治抱负和品德追求。6. 历史语境:结合刘禹锡被贬经历,可知其借陋室赞美暗含对官场污浊的批判,以及保持理想人格的坚定态度。7. 提炼情怀:最终落脚于安贫乐道的生活态度与不同流合污的高尚品格双重特质。",
                "date": "2025-05-05 00:00:00",
                "type": "web"
            }
        ] as Reference[];
    const summaryContent = `根据我已经完成的搜索和分析，现在为您提供《陋室铭》的完整总结：

# 《陋室铭》文章总结

## 一、基本信息
- **作者**：刘禹锡（唐代文学家）
- **体裁**：骈体铭文
- **字数**：81字
- **创作时期**：唐代

## 二、创作背景
刘禹锡因参与"永贞革新"失败被贬至安徽和州任通判。当地知县故意刁难，半年内强迫他搬了三次家，最后只给一间仅容一床一桌一椅的斗室。面对这种羞辱，刘禹锡愤然写下此文并刻石立于门前，表达自己的不屈精神。

## 三、全文结构分析

### 1. 开篇比兴（1-2句）
**"山不在高，有仙则名；水不在深，有龙则灵"**
- 运用山水作比兴，引出文章主旨
- 强调精神内涵的重要性

### 2. 点明主旨（3句）
**"斯是陋室，惟吾德馨"**
- 直接点明主题：陋室不陋，因主人品德高尚
- "德馨"二字是全篇核心

### 3. 环境描写（4-5句）
**"苔痕上阶绿，草色入帘青"**
- 描绘陋室清幽的自然环境
- 体现主人的雅致情趣和与自然的和谐

### 4. 交往对象（6-7句）
**"谈笑有鸿儒，往来无白丁"**
- 表明交往的都是学识渊博之人
- 没有庸俗之客，体现高雅品味

### 5. 日常生活（8-11句）
**"可以调素琴，阅金经。无丝竹之乱耳，无案牍之劳形"**
- 正面描写：弹琴、读经的高雅生活
- 反面衬托：厌弃官场喧嚣和公务烦扰

### 6. 历史典故（12-13句）
**"南阳诸葛庐，西蜀子云亭"**
- 以诸葛亮（南阳草庐）、扬雄（西蜀玄亭）自比
- 表明自己有古代贤人的风骨和志向

### 7. 结尾反问（14句）
**"孔子云：何陋之有？"**
- 引用孔子的话，反问收束
- 强调陋室不陋，深化主题

## 四、核心思想

### 1. 安贫乐道
在简陋环境中保持乐观心态，追求精神富足

### 2. 洁身自好
坚守个人品德，不与世俗同流合污

### 3. 不慕富贵
轻视物质享受，重视精神追求

### 4. 独立人格
在逆境中保持尊严和独立思想

## 五、艺术特色

### 1. 托物言志
借陋室这一具体事物，抒发个人情怀和志向

### 2. 比兴手法
用山水仙龙引出主题，形象生动

### 3. 虚实结合
既有陋室实景描写，又有精神追求表达

### 4. 骈散结合
句式错落有致，既有对仗工整的骈句，又有散句穿插

### 5. 典故运用
引用诸葛亮、扬雄、孔子等历史人物，增强文化底蕴

### 6. 反问收尾
以孔子的话反问作结，发人深省

## 六、现实意义

### 1. 对现代人的启示
- 真正的富贵在于心灵纯净与高尚
- 物质条件不是衡量幸福的唯一标准
- 在逆境中保持精神独立的重要性

### 2. 教育价值
- 培养学生安贫乐道的精神
- 树立正确的价值观和人生观
- 理解中国传统文化中的精神追求

### 3. 社会意义
- 在物质丰富的时代保持精神追求
- 抵制拜金主义和享乐主义
- 弘扬中华优秀传统文化

## 七、教学建议

### 1. 重点讲解
- "德馨"的核心地位
- 比兴手法的运用
- 托物言志的写作技巧

### 2. 拓展思考
- 对比现代人的物质追求与精神追求
- 讨论如何在现代社会中保持"陋室精神"
- 联系其他类似主题的古诗文

### 3. 实践活动
- 背诵全文，体会韵律美
- 仿写练习，学习托物言志手法
- 讨论交流，分享对文章的理解

---

**总结**：《陋室铭》虽然只有81字，但通过精巧的结构、深刻的哲理和优美的语言，表达了作者在逆境中坚守节操、追求精神富足的高尚情操。这篇文章不仅是一篇优秀的文学作品，更是一份宝贵的精神财富，对现代人仍有重要的启示意义。
`;

    const [searchResultsList, setSearchResultsList] = useState<{
        searchResults: Reference[],
    }[]>([]);
    useEffect(() => {
        setTimeout(() => {
            setSearchResultsList(prev => {
                const newList = [...prev];
                newList[0] = {
                    ...newList[0],
                    searchResults: [...searchResults]
                };
                return newList;
            });
        }, 1000);
    }, []);
    return (
        // Steps Container
        <div className="space-y-12 relative pb-20">
            {searchResultsList && searchResultsList.length && searchResultsList[0].searchResults && searchResultsList[0].searchResults.length &&
                <SearchReport isFinish={true} isEndStep={false} step={1} step_name={`搜索《陋室铭》相关资料`} searchResults={searchResultsList[0]?.searchResults}/>}
            {/*<DataAnalysisReport isEndStep={false} step={2} step_name={`数据综合分析`} />*/}
            {/*<PptGenerationReport isEndStep={false} step={3} step_name={`生成演示文稿（PPT）`} />*/}
            {/*<DocumentGenerationReport isEndStep={false} step={4} step_name={`生成 Word 详细文档`} />*/}
            {summaryContent && <SummaryReport isFinish={true} isEndStep={true} step={5} step_name={`直接输出结果`} summaryContent={summaryContent} />}
        </div>
    )
}
