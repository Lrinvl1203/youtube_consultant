import { GoogleGenAI, Type, Chat } from "@google/genai";
import { VideoIdea, ChannelAnalysis, ChatMessage, YouTubeChannel, YouTubeVideoDetails, OneMillionAnalysis, VideoProposal, StoryboardScene } from '../types';
import { Language } from "../lib/translations";

let aiInstance: GoogleGenAI | null = null;

const getAI = (apiKey: string): GoogleGenAI => {
    if (!aiInstance || aiInstance !== aiInstance) {
        aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
};

const videoIdeaSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "A catchy, SEO-optimized video title.",
      },
      description: {
        type: Type.STRING,
        description: "A brief, engaging description for the video concept.",
      },
      tags: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "An array of 3-5 relevant keywords or tags for the video.",
      },
    },
    required: ["title", "description", "tags"],
  },
};

const channelAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        strengths: {
            type: Type.ARRAY,
            items: {type: Type.STRING},
            description: "A list of perceived strengths of the channel based on the provided data."
        },
        weaknesses: {
            type: Type.ARRAY,
            items: {type: Type.STRING},
            description: "A list of potential weaknesses or areas for improvement based on the provided data."
        },
        opportunities: {
            type: Type.ARRAY,
            items: {type: Type.STRING},
            description: "A list of key growth opportunities for the channel based on the provided data."
        },
        videoIdeas: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["title", "description"]
            },
            description: "Three concrete video ideas to capitalize on the opportunities, relevant to the channel's recent content."
        }
    },
    required: ["strengths", "weaknesses", "opportunities", "videoIdeas"]
};

const videoProposalSchema = {
    type: Type.OBJECT,
    properties: {
        titles: {
            type: Type.ARRAY,
            description: "3 catchy, SEO-optimized alternative video titles.",
            items: { type: Type.STRING }
        },
        description: {
            type: Type.STRING,
            description: "A complete, SEO-optimized YouTube video description using insights from the benchmark video."
        },
        tags: {
            type: Type.ARRAY,
            description: "An array of 10-15 relevant keywords and tags for the video.",
            items: { type: Type.STRING }
        },
        script: {
            type: Type.OBJECT,
            properties: {
                hook: { type: Type.STRING, description: "A powerful, 15-second opening hook script." },
                introduction: { type: Type.STRING, description: "A brief introduction to the video's topic and value." },
                mainPoints: {
                    type: Type.ARRAY,
                    description: "3-5 bullet points covering the main sections of the video content.",
                    items: { type: Type.STRING }
                },
                callToAction: { type: Type.STRING, description: "A clear call to action (e.g., subscribe, comment, check link)." },
                outro: { type: Type.STRING, description: "A concluding summary and outro for the video." }
            },
            required: ["hook", "introduction", "mainPoints", "callToAction", "outro"]
        },
        thumbnailConcepts: {
            type: Type.ARRAY,
            description: "2 distinct thumbnail concepts, described in detail including visual elements, text overlays, and emotional tone to maximize click-through rate.",
            items: { type: Type.STRING }
        }
    },
    required: ["titles", "description", "tags", "script", "thumbnailConcepts"]
};

const comparativeAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        userVideo: {
            type: Type.OBJECT,
            properties: {
                strength: { type: Type.STRING, description: "The single biggest strength of the user's video." },
                weakness: { type: Type.STRING, description: "The single biggest weakness of the user's video." }
            },
            required: ["strength", "weakness"]
        },
        benchmarkVideo: {
            type: Type.OBJECT,
            properties: {
                strength: { type: Type.STRING, description: "The single biggest strength of the benchmark video." },
                tacticToAdopt: { type: Type.STRING, description: "The key strategy from the benchmark video that the user should adopt." }
            },
            required: ["strength", "tacticToAdopt"]
        },
        improvementAreas: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "Specific advice to improve the user's video title." },
                thumbnail: { type: Type.STRING, description: "Specific advice to improve the user's thumbnail." },
                content: { type: Type.STRING, description: "Specific advice to improve the user's video content/script." }
            },
            required: ["title", "thumbnail", "content"]
        }
    },
    required: ["userVideo", "benchmarkVideo", "improvementAreas"]
};


const createOneMillionAnalysisSchema = (isComparative: boolean) => ({
    type: Type.OBJECT,
    properties: {
        benchmarkVideoAnalysis: {
            type: Type.OBJECT,
            properties: {
                titleHook: { type: Type.STRING, description: "Analysis of what makes the benchmark video's title effective." },
                contentStrategy: { type: Type.STRING, description: "Analysis of the video's content structure and pacing." },
                targetAudience: { type: Type.STRING, description: "A profile of the likely target audience for this video." },
                monetizationPotential: { type: Type.STRING, description: "Analysis of how this video format could be monetized." },
            },
            required: ["titleHook", "contentStrategy", "targetAudience", "monetizationPotential"]
        },
        consultingResult: isComparative ? comparativeAnalysisSchema : videoProposalSchema,
    },
    required: ["benchmarkVideoAnalysis", "consultingResult"]
});

const storyboardPromptsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            scene: {
                type: Type.STRING,
                description: "A short title for the key visual scene (e.g., 'Opening Hook', 'Core Concept Demo')."
            },
            prompt: {
                type: Type.STRING,
                description: "A detailed, descriptive prompt for an AI image generator to create this scene's visual. It should describe the setting, characters, mood, and camera angle."
            }
        },
        required: ["scene", "prompt"]
    }
};


const oneMillionPrompts = {
    ko: {
        base: "당신은 20년 경력의 맥킨지 출신 세계 최고 수준의 유튜브 성장 컨설턴트이며, 바이럴 영상 전략을 전문으로 합니다. 당신의 분석은 날카롭고, 실행 가능하며, 데이터에 기반합니다. 응답은 반드시 한국어로 작성되어야 합니다.",
        request: "다음 영상(들)에 대한 심층 분석이 필요합니다.",
        benchmarkLabel: "벤치마크 영상",
        userLabel: "사용자 영상",
        detailsLabel: "상세 정보",
        videoDataLabels: {
            title: "제목",
            views: "조회수",
            likes: "좋아요",
            description: "설명",
            tags: "태그",
        },
        newTask: {
            title: "**과제:**",
            step1: "1.  **벤치마크 영상 분석:** 벤치마크 영상의 제목 후크, 콘텐츠 전략, 타겟 고객, 수익화 잠재력을 심층 분석하세요.",
            step2: "2.  **새로운 영상 기획안 제작:** 분석을 바탕으로, 비슷하거나 더 큰 성공을 거둘 수 있는 새로운 영상의 완전한 기획안을 만드세요. 이 기획안에는 다음이 포함되어야 합니다:\n    - 3개의 대안적이고 눈길을 끄는 제목.\n    - 완전하고 SEO에 최적화된 설명.\n    - 10-15개의 관련 태그 목록.\n    - 구조화된 스크립트 개요 (후크, 도입, 요점, CTA, 아웃트로).\n    - 2개의 상세한 썸네일 콘셉트.",
        },
        comparativeTask: {
            title: "**과제:**",
            step1: "1.  **벤치마크 영상 분석:** 벤치마크 영상의 제목 후크, 콘텐츠 전략, 타겟 고객, 수익화 잠재력을 간략히 분석하세요.",
            step2: "2.  **비교 분석:** 사용자의 영상을 벤치마크 영상과 비교하세요. 각각의 가장 큰 강점과 약점을 하나씩 파악하세요.",
            step3: "3.  **실행 가능한 조언 제공:** 벤치마크 영상의 성공을 바탕으로 사용자의 영상 제목, 썸네일, 콘텐츠에 대한 구체적인 개선 제안을 하세요. 당신의 목표는 사용자가 영상 성과를 개선할 수 있는 명확한 경로를 제공하는 것입니다.",
        },
        fullScript: {
            prompt: "당신은 전문 유튜브 스크립트 작가입니다. 다음 영상 제목과 스크립트 개요를 바탕으로, 8-10분 분량의 완전하고 흡입력 있는 상세 스크립트를 작성해주세요. 대사, 카메라 앵글 제안(예: '클로즈업', '와이드 샷'), 그리고 화면에 표시될 텍스트/그래픽 콜아웃을 포함해야 합니다. 스크립트는 반드시 한국어로 작성되어야 합니다."
        },
        storyboard: {
            prompt: "당신은 크리에이티브 디렉터입니다. 다음 영상 제목과 스크립트 개요를 바탕으로, 영상을 매력적인 스토리보드로 만들 수 있는 4가지 핵심 시각적 장면으로 나누어 주세요. 각 장면에 대해 짧은 제목과 함께, AI 이미지 생성기를 위한 상세하고 구체적인 프롬프트를 제공해주세요. 프롬프트는 배경, 인물, 분위기, 카메라 앵글을 묘사해야 합니다. 응답은 반드시 한국어로 작성되어야 합니다."
        }
    },
    en: {
        base: "You are a world-class YouTube growth consultant with 20 years of experience at McKinsey, specializing in viral video strategy. Your analysis is sharp, actionable, and data-driven. Your response must be in English.",
        request: "I need a deep analysis of the following video(s).",
        benchmarkLabel: "Benchmark Video",
        userLabel: "User's Video",
        detailsLabel: "Video Details",
        videoDataLabels: {
            title: "Title",
            views: "Views",
            likes: "Likes",
            description: "Description",
            tags: "Tags",
        },
        newTask: {
            title: "**Task:**",
            step1: "1.  **Analyze Benchmark Video:** Deeply analyze the benchmark video's title hook, content strategy, target audience, and monetization potential.",
            step2: "2.  **Create a New Video Blueprint:** Based on the analysis, create a complete blueprint for a NEW video that could achieve similar or greater success. This blueprint must include:\n    - 3 alternative, catchy titles.\n    - A full, SEO-optimized description.\n    - A list of 10-15 relevant tags.\n    - A structured script outline (Hook, Intro, Main Points, CTA, Outro).\n    - 2 detailed thumbnail concepts.",
        },
        comparativeTask: {
            title: "**Task:**",
            step1: "1.  **Analyze Benchmark Video:** Briefly analyze the benchmark video's title hook, content strategy, target audience, and monetization potential.",
            step2: "2.  **Comparative Analysis:** Compare the user's video to the benchmark. Identify the single biggest strength and weakness for each.",
            step3: "3.  **Provide Actionable Advice:** Give concrete improvement suggestions for the user's video title, thumbnail, and content based on the benchmark's success. Your goal is to provide a clear path for the user to improve their video's performance.",
        },
        fullScript: {
            prompt: "You are a professional YouTube scriptwriter. Based on the following video title and script outline, write a complete, engaging, and detailed script for an 8-10 minute video. Include spoken lines, camera shot suggestions (e.g., 'close-up', 'wide shot'), and on-screen text/graphics callouts. The script must be in English."
        },
        storyboard: {
            prompt: "You are a creative director. Based on the following video title and script outline, break the video down into 4 key visual scenes for a compelling storyboard. For each scene, provide a short title and a detailed, descriptive prompt for an AI image generator. The prompt should describe the setting, characters, mood, and camera angle. Your response must be in English."
        }
    },
    ja: {
        base: "あなたはマッキンゼーで20年の経験を持つ世界クラスのYouTubeグロースコンサルタントであり、バイラル動画戦略を専門としています。あなたの分析は鋭く、実行可能で、データに基づいています。応答は必ず日本語でなければなりません。",
        request: "以下の動画の詳細な分析が必要です。",
        benchmarkLabel: "ベンチマーク動画",
        userLabel: "ユーザーの動画",
        detailsLabel: "動画詳細",
        videoDataLabels: {
            title: "タイトル",
            views: "視聴回数",
            likes: "高評価",
            description: "説明",
            tags: "タグ",
        },
        newTask: {
            title: "**タスク:**",
            step1: "1.  **ベンチマーク動画の分析:** ベンチマーク動画のタイトルのフック、コンテンツ戦略、ターゲットオーディエンス、収益化の可能性を深く分析してください。",
            step2: "2.  **新しい動画の設計図を作成:** 分析に基づき、同様またはそれ以上の成功を収める可能性のある新しい動画の完全な設計図を作成してください。この設計図には、以下を含める必要があります：\n    - 3つのキャッチーな代替タイトル。\n    - SEOに最適化された完全な説明文。\n    - 10〜15個の関連タグのリスト。\n    - 構造化されたスクリプトの概要（フック、導入、要点、CTA、アウトロ）。\n    - 2つの詳細なサムネイルコンセプト。",
        },
        comparativeTask: {
            title: "**タスク:**",
            step1: "1.  **ベンチマーク動画の分析:** ベンチマーク動画のタイトルのフック、コンテンツ戦略、ターゲットオーディエンス、収益化の可能性を簡潔に分析してください。",
            step2: "2.  **比較分析:** ユーザーの動画とベンチマーク動画を比較します。それぞれの最大の長所と短所を1つずつ特定してください。",
            step3: "3.  **実行可能なアドバイスを提供:** ベンチマーク動画の成功に基づき、ユーザーの動画のタイトル、サムネイル、コンテンツに関する具体的な改善提案を行ってください。あなたの目標は、ユーザーが動画のパフォーマンスを向上させるための明確な道筋を提供することです。",
        },
        fullScript: {
            prompt: "あなたはプロのYouTubeスクリプトライターです。以下の動画タイトルとスクリプト概要に基づき、8〜10分の完全で魅力的な詳細スクリプトを作成してください。台詞、カメラショットの提案（例：「クローズアップ」、「ワイドショット」）、画面上のテキスト/グラフィックの指示を含める必要があります。スクリプトは必ず日本語で作成してください。"
        },
        storyboard: {
            prompt: "あなたはクリエイティブディレクターです。以下の動画タイトルとスクリプト概要に基づき、動画を魅力的なストーリーボードにするための4つの主要なビジュアルシーンに分割してください。各シーンについて、短いタイトルと、AI画像ジェネレーター用の詳細で記述的なプロンプトを提供してください。プロンプトは、設定、キャラクター、雰囲気、カメラアングルを説明する必要があります。応答は必ず日本語でなければなりません。"
        }
    },
    zh: {
        base: "您是一位世界级的YouTube增长顾问，在麦肯锡拥有20年经验，专注于病毒式视频策略。您的分析敏锐、可操作且以数据为驱动。您的回复必须使用简体中文。",
        request: "我需要对以下视频进行深入分析。",
        benchmarkLabel: "基准视频",
        userLabel: "用户的视频",
        detailsLabel: "视频详情",
        videoDataLabels: {
            title: "标题",
            views: "观看次数",
            likes: "点赞数",
            description: "描述",
            tags: "标签",
        },
        newTask: {
            title: "**任务:**",
            step1: "1.  **分析基准视频:** 深入分析基准视频的标题吸引点、内容策略、目标受众和变现潜力。",
            step2: "2.  **创建新视频蓝图:** 基于分析，为可能取得类似或更大成功的新视频创建一个完整的蓝图。此蓝图必须包括：\n    - 3个备选的、吸引人的标题。\n    - 完整的、经过SEO优化的描述。\n    - 包含10-15个相关标签的列表。\n    - 结构化的脚本大纲（钩子、引言、要点、号召性用语、结尾）。\n    - 2个详细的缩略图概念。",
        },
        comparativeTask: {
            title: "**任务:**",
            step1: "1.  **分析基准视频:** 简要分析基准视频的标题吸引点、内容策略、目标受众和变现潜力。",
            step2: "2.  **比较分析:** 将用户的视频与基准视频进行比较。找出各自最大的一个优点和一个缺点。",
            step3: "3.  **提供可行的建议:** 根据基准视频的成功经验，为用户的视频标题、缩略图和内容提供具体的改进建议。您的目标是为用户提供一条清晰的路径，以提高其视频性能。",
        },
        fullScript: {
            prompt: "您是一位专业的YouTube剧本作家。根据以下视频标题和剧本大纲，为一段8-10分钟的视频编写一个完整、引人入胜且详细的剧本。包括口语对话、摄像机镜头建议（例如，“特写”、“广角镜头”）以及屏幕上的文本/图形标注。剧本必须使用简体中文。"
        },
        storyboard: {
            prompt: "您是一位创意总监。根据以下视频标题和剧本大纲，将视频分解为4个关键视觉场景，以制作引人注目的故事板。为每个场景提供一个简短的标题和一个详细的、描述性的提示，供AI图像生成器使用。该提示应描述场景、角色、情绪和摄像机角度。您的回复必须使用简体中文。"
        }
    }
};


const formatVideoDataForPrompt = (video: YouTubeVideoDetails, role: string, labels: { title: string; views: string; likes: string; description: string; tags: string; }, detailsLabel: string) => `
**${role} ${detailsLabel}:**
- **${labels.title}:** ${video.title}
- **${labels.views}:** ${parseInt(video.stats?.viewCount || '0', 10).toLocaleString()}
- **${labels.likes}:** ${parseInt(video.stats?.likeCount || '0', 10).toLocaleString()}
- **${labels.description}:** ${video.description?.substring(0, 300) || 'No description'}...
- **${labels.tags}:** ${video.tags?.slice(0, 10).join(', ') || 'No tags'}
`;

export const generateOneMillionConsulting = async (apiKey: string, benchmarkVideo: YouTubeVideoDetails, language: Language, userVideo?: YouTubeVideoDetails): Promise<OneMillionAnalysis> => {
    const isComparative = !!userVideo;
    const selectedPrompts = oneMillionPrompts[language] || oneMillionPrompts.en;

    let prompt = `${selectedPrompts.base}\n\n${selectedPrompts.request}\n\n${formatVideoDataForPrompt(benchmarkVideo, selectedPrompts.benchmarkLabel, selectedPrompts.videoDataLabels, selectedPrompts.detailsLabel)}\n`;

    if (isComparative && userVideo) {
        prompt += formatVideoDataForPrompt(userVideo, selectedPrompts.userLabel, selectedPrompts.videoDataLabels, selectedPrompts.detailsLabel);
        prompt += `\n${selectedPrompts.comparativeTask.title}\n${selectedPrompts.comparativeTask.step1}\n${selectedPrompts.comparativeTask.step2}\n${selectedPrompts.comparativeTask.step3}\n`;
    } else {
        prompt += `\n${selectedPrompts.newTask.title}\n${selectedPrompts.newTask.step1}\n${selectedPrompts.newTask.step2}\n`;
    }

    const ai = getAI(apiKey);
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: createOneMillionAnalysisSchema(isComparative),
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};

export const generateFullScript = async (apiKey: string, scriptOutline: VideoProposal['script'], videoTitle: string, language: Language): Promise<string> => {
    const selectedPrompts = oneMillionPrompts[language] || oneMillionPrompts.en;
    const prompt = `
${selectedPrompts.fullScript.prompt}

**Video Title:** ${videoTitle}

**Script Outline:**
- **Hook:** ${scriptOutline.hook}
- **Introduction:** ${scriptOutline.introduction}
- **Main Points:** 
${scriptOutline.mainPoints.map(p => `  - ${p}`).join('\n')}
- **Call to Action:** ${scriptOutline.callToAction}
- **Outro:** ${scriptOutline.outro}
`;
    const ai = getAI(apiKey);
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text;
}

export const generateStoryboardPrompts = async (apiKey: string, videoTitle: string, scriptOutline: VideoProposal['script'], language: Language): Promise<StoryboardScene[]> => {
    const selectedPrompts = oneMillionPrompts[language] || oneMillionPrompts.en;
    const prompt = `
${selectedPrompts.storyboard.prompt}

**Video Title:** ${videoTitle}

**Script Outline:**
- **Hook:** ${scriptOutline.hook}
- **Introduction:** ${scriptOutline.introduction}
- **Main Points:** 
${scriptOutline.mainPoints.map(p => `  - ${p}`).join('\n')}
- **Call to Action:** ${scriptOutline.callToAction}
- **Outro:** ${scriptOutline.outro}
`;

    const ai = getAI(apiKey);
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: storyboardPromptsSchema,
        }
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};

export const generateThumbnailImage = async (apiKey: string, prompt: string): Promise<string> => {
    const ai = getAI(apiKey);
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Create a cinematic, high-impact YouTube thumbnail based on this concept: "${prompt}". Ensure it is visually striking, easy to read, and evokes curiosity. Aspect ratio 16:9.`,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed to produce an image.");
    }

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return base64ImageBytes;
};


export const generateKeywordIdeas = async (apiKey: string, keyword: string): Promise<VideoIdea[]> => {
  const prompt = `You are an expert YouTube growth strategist. A user wants to create content about "${keyword}". Generate 5 creative, high-engagement video ideas. For each idea, provide a catchy, SEO-optimized title, a brief description, and 3-5 relevant keywords/tags.`;

  const ai = getAI(apiKey);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: videoIdeaSchema,
    },
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText);
};

export const generateChannelAnalysis = async (apiKey: string, channelData: YouTubeChannel): Promise<ChannelAnalysis> => {
    const videoTitles = channelData.videos.map(v => `- "${v.title}"`).join('\n');
    const prompt = `
You are a professional YouTube channel analyst. I will provide you with data fetched directly from the YouTube API.
Analyze the following channel:

**Channel Name:** ${channelData.title}
**Subscribers:** ${parseInt(channelData.stats?.subscriberCount || '0').toLocaleString()}
**Total Views:** ${parseInt(channelData.stats?.viewCount || '0').toLocaleString()}
**Total Videos:** ${parseInt(channelData.stats?.videoCount || '0').toLocaleString()}

**Recent Video Titles:**
${videoTitles}

Based *only* on this provided data, perform an expert analysis. Provide:
1.  **Perceived Strengths:** At least 3 strengths suggested by the data (e.g., "Strong subscriber base indicates loyal audience", "Consistent uploads based on recent videos").
2.  **Potential Weaknesses:** At least 3 potential weaknesses (e.g., "Video titles may lack a clear SEO focus", "View count to subscriber ratio could be improved").
3.  **Key Opportunities for Growth:** At least 3 actionable opportunities (e.g., "Create a series based on the most popular recent video topics", "Collaborate with channels of similar size").
4.  **Three Concrete Video Ideas:** Provide titles and descriptions for three video ideas that directly capitalize on the opportunities you've identified and are relevant to the recent video titles.
`;

  const ai = getAI(apiKey);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: channelAnalysisSchema
    }
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText);
};


export const getChatStream = async (apiKey: string, history: ChatMessage[], newMessage: string) => {
    const ai = getAI(apiKey);
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are 'Creator Boost AI', an expert YouTube consultant. Your goal is to provide actionable, data-driven advice to help content creators grow their channels and monetize their content. Be encouraging, specific, and professional. Use markdown for formatting like lists, bolding, and italics to make your responses easy to read.",
        },
        history,
    });

    const result = await chat.sendMessageStream({ message: newMessage });
    return result;
};