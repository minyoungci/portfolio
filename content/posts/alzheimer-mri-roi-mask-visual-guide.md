> **핵심 요약**
> 이 글은 `KDRC_24006526 / ses-1` T1w MRI 위에 알츠하이머 및 치매 연구에서 자주 다루는 구조적 ROI를 overlay로 보여주고, 각 구조가 어디에 있으며 어떤 해석 오류를 조심해야 하는지 정리한다.

> **중요한 주의**
> 아래 이미지는 한 subject의 segmentation QC 예시다. 이 이미지 하나로 알츠하이머 여부, 인지 상태, amyloid positivity를 판단할 수 없다. ROI mask는 “측정 범위”를 보여주는 것이지 “진단 결과”가 아니다.

![AD-relevant ROI montage](/images/articles/mri-gallery-20260507/ad_roi_masks/ad_relevant_roi_montage.jpg)

## 이미지와 생성 기준

원본 gallery에는 hippocampus ROI overlay가 포함되어 있었다. 이 글에서는 같은 gallery의 `aparc_DKT_on_hdbet_grid.nii.gz`와 `native_t1w_hdbet.nii.gz`를 이용해 AD 관련 구조별 overlay 이미지를 추가로 사용한다.

- Source segmentation: `/home/vlm/data/preprocessed_official/v1/_reports/preprocessing_stage_gallery_20260507/aparc_DKT_on_hdbet_grid.nii.gz`
- Source T1w brain: `/home/vlm/data/preprocessed_official/v1/KDRC/subjects/24006526/ses-1/t1w/native_t1w_hdbet.nii.gz`
- Generated assets: `/images/articles/mri-gallery-20260507/ad_roi_masks/`

육안 QC상 montage에서는 ROI가 대체로 기대되는 해부학적 위치에 있으며, 뇌 밖으로 크게 벗어나거나 명백한 gross misregistration을 보이지 않는다. 단, 이는 정량적 segmentation validation이 아니라 시각적 sanity check다.

---

# 먼저 알아야 할 구조 MRI 해석 원칙

## 1. T1w MRI는 병리를 직접 보는 영상이 아니다

T1-weighted MRI는 amyloid plaque나 tau pathology를 직접 보여주지 않는다. 우리가 보는 것은 voxel 단위의 MR signal이고, 이 signal은 조직 특성과 acquisition protocol에 의해 결정된다.

일반적으로 T1w에서는 다음 대비가 유용하다.

- White matter: 상대적으로 밝게 보임
- Gray matter: 중간 정도 밝기
- CSF: 어둡게 보임
- Skull/background: 전처리 후 제거되거나 0에 가까움

따라서 ROI mask overlay는 “이 영역에 amyloid가 있다”가 아니라 **이 subject의 T1w 공간에서 특정 해부학적 label이 어디에 놓였는지**를 보여준다.

## 2. Atrophy는 downstream neurodegeneration의 형태다

Structural MRI에서 neurodegeneration은 대개 다음 형태로 간접 관찰된다.

- 특정 gray matter structure의 volume 감소
- cortical thinning
- sulcal widening
- hippocampal/medial temporal lobe shrinkage
- ex vacuo ventricular enlargement
- longitudinal scan에서 같은 subject의 tissue loss rate 증가

Vemuri & Jack 2010은 sMRI atrophy가 AD neurodegeneration의 stage/intensity biomarker로 쓰일 수 있다고 설명하지만, sMRI가 amyloid/tau pathology 자체를 직접 측정하는 것은 아니다.

## 3. “AD-relevant”와 “AD-specific”은 다르다

아래 구조들은 AD 연구에서 중요하지만 대부분 AD에만 특이적이지 않다.

- Hippocampal atrophy는 AD와 관련되지만 정상 노화, vascular injury, epilepsy, depression, LATE/TDP-43, Lewy body disease 등과도 관련될 수 있다.
- Posterior cingulate/precuneus는 AD network에서 중요하지만 structural MRI 단독 signal은 FDG-PET나 tau-PET보다 덜 직접적일 수 있다.
- Ventricle enlargement는 neurodegeneration의 간접 지표지만 hydrocephalus, brain reserve, 정상 노화, vascular burden의 영향을 받는다.

논문에서 안전한 표현은 “AD-relevant”, “AD-associated”, “dementia-relevant anatomical region”이다. 단일 structural ROI를 “AD-specific biomarker”라고 쓰면 위험하다.

## 4. ROI 해석에서 반드시 통제할 confound

- Age
- Sex / head size / intracranial volume, ICV
- Scanner / protocol / site
- Motion / blur
- Skull stripping error
- Registration / affine mismatch
- Atlas definition
- Partial volume effect
- Longitudinal preprocessing consistency

---

# 1. Hippocampus / 해마

![Hippocampus overlay](/images/articles/mri-gallery-20260507/ad_roi_masks/hippocampus_overlay.jpg)

## 어디에 있나?

해마는 양측 내측 측두엽 깊은 곳에 위치한다. Lateral ventricle의 inferior horn 안쪽/아래쪽을 따라 앞뒤로 길게 놓인 C자형 구조이며, anterior hippocampal head, body, tail로 나누어 생각할 수 있다.

## 왜 중요한가?

해마는 episodic memory 형성, 새로운 정보의 encoding/consolidation, spatial memory와 관련된다. AD 연구에서는 medial temporal lobe 위축, 특히 hippocampus와 entorhinal cortex의 위축이 구조 MRI의 대표 marker 후보로 다뤄져 왔다.

Vemuri & Jack 2010 및 Frisoni et al. 2010은 AD neurodegeneration에서 medial temporal lobe, entorhinal cortex, hippocampus가 중요하다고 정리한다. 다만 해마 위축은 AD 특이적이지 않으므로 PET, cognition, longitudinal progression과 함께 해석해야 한다.

## QC에서 볼 것

- 좌우 해마가 모두 존재하는가?
- ROI가 내측 측두엽의 예상 위치에 있는가?
- anterior head/body/tail이 과하게 끊기지 않았는가?
- lateral ventricle, choroid plexus, white matter, amygdala를 과하게 포함하지 않는가?
- 한 장의 axial slice가 아니라 3D mask 전체에서 volume과 boundary가 합리적인가?

---

# 2. Entorhinal cortex / 내후각피질

![Entorhinal cortex overlay](/images/articles/mri-gallery-20260507/ad_roi_masks/entorhinal_cortex_overlay.jpg)

## 어디에 있나?

내후각피질은 medial temporal lobe의 cortical structure로, parahippocampal gyrus의 anterior/medial portion에 위치한다. 해마와 neocortex를 연결하는 cortical gateway에 가깝다.

## 왜 중요한가?

Entorhinal/transentorhinal region은 AD 관련 tau pathology의 초기 site로 자주 논의된다. Yushkevich et al. 2024의 ADNI3 high-resolution MTL MRI review는 tau burden이 증가하면서 transentorhinal region, BA35/lateral entorhinal cortex, CA1/subiculum 등에서 thinning이 확장되는 pattern을 설명한다.

Dickerson et al. 2001은 non-demented cognitive complaint group의 conversion 예측에서 entorhinal cortex volume이 hippocampal volume보다 더 잘 구분했다는 결과를 보고했다.

## QC에서 볼 것

- ROI가 해마 앞쪽/내측 측두엽 주변에 위치하는가?
- 좌우 label이 모두 존재하는가?
- cortical ribbon처럼 얇게 놓이는가, 비현실적으로 두껍게 퍼지는가?
- 주변 parahippocampal/perirhinal cortex와 boundary가 atlas 정의상 합리적인가?

## 해석 주의

Entorhinal cortex는 작고 얇은 cortical ROI라서 T1w segmentation error의 영향을 크게 받는다. Subfield 또는 세부 cortical claim은 high-resolution T2, dedicated MTL segmentation, PET/clinical endpoint와 결합할 때 더 안전하다.

---

# 3. Amygdala / 편도체

![Amygdala overlay](/images/articles/mri-gallery-20260507/ad_roi_masks/amygdala_overlay.jpg)

## 어디에 있나?

편도체는 anterior medial temporal lobe에 위치하며, 해마 head보다 앞쪽/위쪽에 가깝다. Temporal pole, uncus, lateral ventricle inferior horn과 인접한다.

## 왜 중요한가?

편도체는 fear/threat processing, salience, reward learning, affective memory에 관여한다. AD의 중심 structural biomarker라기보다는 medial temporal/limbic degeneration의 일부로 해석하는 것이 안전하다.

Krasuski et al. 1998은 mild AD와 MCI에서 hippocampus, amygdala, anterior/posterior parahippocampal gyrus 등 medial temporal lobe 구조의 volume 감소를 보고했다.

## QC에서 볼 것

- 편도체 ROI가 해마보다 전방/상방 쪽에 위치하는가?
- 해마 ROI와 과하게 겹치거나 뒤섞이지 않는가?
- temporal pole 또는 CSF를 과하게 포함하지 않는가?
- 좌우 크기가 극단적으로 비대칭이지 않은가?

---

# 4. Parahippocampal cortex / 해마곁피질

![Parahippocampal cortex overlay](/images/articles/mri-gallery-20260507/ad_roi_masks/parahippocampal_cortex_overlay.jpg)

## 어디에 있나?

해마곁피질은 medial temporal lobe의 cortical region으로, 해마 아래쪽/안쪽을 따라 놓인 parahippocampal gyrus에 해당한다. Anterior portion은 entorhinal/perirhinal cortex와 가깝고, posterior portion은 scene/context processing network와 연결된다.

## 왜 중요한가?

AD neurodegeneration은 medial temporal lobe network에서 시작하거나 두드러지는 경향이 있으므로, 해마곁피질은 hippocampus-only 분석의 주변 구조로 의미가 있다. ROI-wise representation이나 PET/MRI regional alignment에서는 hippocampus, entorhinal cortex, parahippocampal cortex를 함께 보는 것이 해부학적으로 더 일관된다.

## QC에서 볼 것

- ROI가 하내측 측두엽에 위치하는가?
- hippocampus/amygdala label과 과하게 섞이지 않는가?
- cortical label이 brain 외부로 벗어나지 않는가?
- atlas 정의상 anterior/posterior parahippocampal region이 합리적인가?

---

# 5. Posterior cingulate / 후대상피질

![Posterior cingulate overlay](/images/articles/mri-gallery-20260507/ad_roi_masks/posterior_cingulate_overlay.jpg)

## 어디에 있나?

후대상피질은 뇌의 정중선 안쪽, corpus callosum 뒤쪽/위쪽에 위치하는 medial parietal-limbic cortical region이다. Retrosplenial cortex 및 precuneus와 인접한다.

## 왜 중요한가?

후대상피질은 default mode network의 핵심 hub이며, autobiographical memory retrieval, attention switching, cognitive integration과 관련된다. AD에서는 medial temporal lobe뿐 아니라 posterior cingulate, precuneus, temporoparietal association cortex 같은 posterior network도 자주 논의된다.

Frisoni et al. 2010은 early atrophy pattern에 entorhinal cortex, hippocampus, posterior cingulate cortex가 관련될 수 있다고 설명한다. 단, posterior cingulate의 AD 관련성은 structural MRI보다 FDG-PET/functional connectivity/PET pathology 문헌에서 더 강한 경우가 많다.

## QC에서 볼 것

- ROI가 midline posterior cortical region에 위치하는가?
- corpus callosum이나 ventricle을 과하게 포함하지 않는가?
- precuneus와 boundary가 비정상적으로 섞이지 않는가?
- cortical thinning 분석을 한다면 surface/cortical thickness pipeline과 일관되는가?

---

# 6. Precuneus / 쐐기앞소엽

![Precuneus overlay](/images/articles/mri-gallery-20260507/ad_roi_masks/precuneus_overlay.jpg)

## 어디에 있나?

Precuneus는 후내측 두정엽에 위치하며, posterior cingulate의 위쪽/뒤쪽, parieto-occipital sulcus 앞쪽에 놓인다. 비교적 큰 medial association cortex 영역이다.

## 왜 중요한가?

Precuneus는 default mode network, self-referential processing, visuospatial integration, episodic memory retrieval과 관련된다. AD 연구에서는 posterior cingulate와 함께 posterior cortical network의 핵심 구조로 자주 언급된다.

## QC에서 볼 것

- ROI가 posterior medial parietal cortex에 위치하는가?
- posterior cingulate와 boundary가 비정상적으로 섞이지 않는가?
- cortical label이 skull stripping/crop에 의해 잘리지 않았는가?
- sulcal anatomy 차이 때문에 cohort별 segmentation bias가 생기지 않는가?

---

# 7. Ventricular CSF spaces / 뇌실 CSF 공간

![Ventricles overlay](/images/articles/mri-gallery-20260507/ad_roi_masks/ventricles_overlay.jpg)

## 어디에 있나?

뇌실은 CSF가 차 있는 공간이다. 주요 구성은 lateral ventricles, third ventricle, fourth ventricle, inferior lateral ventricles 등이다. Lateral ventricle의 inferior horn은 해마와 가까운 temporal lobe 안쪽으로 내려간다.

## 왜 중요한가?

Neurodegeneration으로 brain tissue가 줄어들면 ex vacuo ventricular enlargement가 나타날 수 있다. Frisoni et al. 2010은 hippocampal/whole-brain atrophy와 ventricular enlargement가 progression marker로 사용될 수 있음을 설명한다. Vemuri & Jack 2010도 atrophy가 CSF space expansion과 함께 나타날 수 있음을 정리한다.

## QC에서 볼 것

- 뇌실 mask가 CSF space를 따라가는가?
- surrounding white matter를 과하게 포함하지 않는가?
- inferior lateral ventricle label이 hippocampus/choroid plexus와 혼동되지 않는가?
- crop/pad 후 뇌실 위치가 유지되는가?

## 해석 주의

Ventricular enlargement는 atrophy의 간접 지표일 수 있지만 AD 특이적이지 않다. 정상 노화, vascular injury, hydrocephalus, brain reserve, ICV의 영향을 받는다.

---

# ROI overlay를 연구 설계에 쓰는 방법

## 1. Anatomical pooling

Whole-brain encoder feature를 ROI별로 pool하면 hippocampus/entorhinal/posterior network feature가 PET amyloid 또는 clinical progression과 어떻게 연결되는지 볼 수 있다. 단, age/sex/ICV/site 보정 baseline과 비교해야 한다.

## 2. ROI ablation

모델이 정말 AD-relevant region을 쓰는지 검증하려면 아래 ablation이 필요하다.

- hippocampus-only
- medial-temporal-only
- posterior-network-only
- ventricle/CSF-only
- random ROI
- non-AD ROI
- whole-brain without medial temporal ROI

ROI attention이 높다고 설명 가능성이 자동으로 생기지는 않는다. Ablation으로 성능 변화가 보여야 한다.

## 3. PET/MRI regional alignment

Amyloid PET은 plaque burden, tau PET은 tau pathology, FDG-PET은 metabolism, structural MRI는 atrophy/neurodegeneration을 다룬다. 서로 disease cascade의 다른 층위를 본다. MRI feature가 amyloid burden과 직접 대응한다고 과장하면 안 된다.

## 4. Longitudinal change probe

Baseline/follow-up T1w pair에서 medial temporal ROI representation 변화가 conversion/progression과 연결되는지 볼 수 있다. 단, subject-level split, time gap distribution, scanner/protocol change, preprocessing version 동일성, visit leakage 방지가 먼저다.

---

# 논문/실험 report용 체크리스트

## Dataset/QC

- 전체 ready manifest에서 ROI mask 존재율
- ROI별 voxel count distribution
- site/cohort/diagnosis별 ROI failure rate
- outlier subject 목록과 exclusion rule
- HD-BET/FastSurfer/final tensor QC status

## Confound control

- age, sex, ICV 보정 여부
- site/scanner/protocol 보정 또는 split 설계
- diagnosis group별 age/sex imbalance
- MCI subtype/label noise
- repeated visits 처리 방식

## Metric clarity

- volume인지 cortical thickness인지 voxel count인지 representation feature인지 구분
- left/right 따로 보는지 bilateral sum인지 명시
- raw volume인지 ICV-normalized volume인지 명시
- ROI mask가 native space인지 final tensor space인지 명시

## Claim boundary

- “AD diagnosis 가능”이 아니라 “AD-associated structural pattern”인지 구분
- PET/clinical endpoint 없이 amyloid biology를 주장하지 않기
- single subject overlay를 population-level evidence로 쓰지 않기
- segmentation-derived ROI와 coordinate patch를 혼동하지 않기

---

# 리뷰어가 공격할 지점

1. **ROI segmentation이 정확한가?**
   FastSurfer label이 cohort별로 안정적인지, failure가 특정 diagnosis/site에 치우치지 않는지 보여야 한다.

2. **해마를 봤다는 것이 곧 AD biology를 봤다는 뜻인가?**
   아니다. 해마 위축은 AD 관련성이 있지만 비특이적이다. PET amyloid/tau, longitudinal cognition, clinical progression과 연결해야 한다.

3. **Entorhinal cortex처럼 작은 cortical ROI를 T1w/FastSurfer로 얼마나 믿을 수 있는가?**
   high-resolution T2 또는 dedicated MTL segmentation 없이 subfield/세부 cortical claim을 하면 약하다.

4. **ROI attention 또는 mask overlay가 설명 가능한가?**
   overlay는 위치 확인일 뿐이다. 설명 가능성을 주장하려면 occlusion, ablation, random ROI control, non-image shortcut baseline이 필요하다.

5. **cohort/site/scanner shortcut을 제거했는가?**
   ROI feature도 cohort shortcut을 가질 수 있다. 특히 segmentation quality 자체가 scanner/protocol 영향을 받을 수 있다.

6. **single subject 예시를 population claim으로 확장하고 있지 않은가?**
   이 글의 이미지는 한 subject의 QC example이다. 논문 claim은 전체 cohort-level statistics와 split-safe evaluation으로만 가능하다.

---

# Min 연구에서의 추천 활용법

가장 방어 가능한 방향은 “예쁜 ROI visualization”이 아니라 다음 순서다.

1. 전체 ready manifest에서 ROI mask 존재율과 voxel count distribution 확인
2. diagnosis/site/scanner/QC별 ROI failure rate 확인
3. hippocampus/entorhinal/ventricle volume의 age/sex/ICV-adjusted baseline 분석
4. non-image shortcut baseline과 비교
5. PET amyloid/centiloid/SUVR endpoint와 ROI-wise MRI feature probing
6. ROI ablation으로 모델이 실제 AD-relevant structure에 의존하는지 검증
7. longitudinal pair에서는 preprocessing artifact와 scanner/protocol change를 progression signal과 분리

즉 ROI mask는 논문 그림을 예쁘게 만드는 도구가 아니라, 모델이 **어디를 보고 무엇을 배웠는지 반증 가능한 방식으로 따지는 장치**로 써야 한다.

## 관련 글

- T1w MRI 전처리 파이프라인 가이드

## 참고 문헌 / 근거

- Vemuri P, Jack CR Jr. *Role of structural MRI in Alzheimer’s disease*. Alzheimer’s Research & Therapy. 2010;2(4):23. DOI: 10.1186/alzrt47. PMID: 20807454. PMCID: PMC2949589. https://pmc.ncbi.nlm.nih.gov/articles/PMC2949589/
- Frisoni GB, Fox NC, Jack CR Jr, Scheltens P, Thompson PM. *The clinical use of structural MRI in Alzheimer disease*. Nature Reviews Neurology. 2010;6(2):67–77. DOI: 10.1038/nrneurol.2009.215. PMID: 20139996. PMCID: PMC2938772. https://pmc.ncbi.nlm.nih.gov/articles/PMC2938772/
- Dickerson BC, Goncharova I, Sullivan MP, Forchetti C, Wilson RS, Bennett DA, Beckett LA, deToledo-Morrell L. *MRI-derived entorhinal and hippocampal atrophy in incipient and very mild Alzheimer’s disease*. Neurobiology of Aging. 2001;22(5):747–754. DOI: 10.1016/s0197-4580(01)00271-8. PMID: 11705634.
- Petersen RC, Jack CR Jr, Xu YC, Waring SC, O’Brien PC, Smith GE, Ivnik RJ, Tangalos EG. *Memory and MRI-based hippocampal volumes in aging and AD*. Neurology. 2000;54(3):581–587. DOI: 10.1212/wnl.54.3.581. PMID: 10680786.
- Krasuski JS, Alexander GE, Horwitz B, Daly EM, Murphy DG, Rapoport SI, Schapiro MB. *Volumes of medial temporal lobe structures in patients with Alzheimer’s disease and mild cognitive impairment (and in healthy controls)*. Biological Psychiatry. 1998;43(1):60–68. DOI: 10.1016/s0006-3223(97)00013-9. PMID: 9442345.
- Yushkevich PA, Ittyerah R, Li Y, et al. *Morphometry of medial temporal lobe subregions using high-resolution T2-weighted MRI in ADNI3: Why, how, and what’s next?* Alzheimer’s & Dementia. 2024;20(11):8113–8128. DOI: 10.1002/alz.14161. PMID: 39279366. PMCID: PMC11567830. https://pmc.ncbi.nlm.nih.gov/articles/PMC11567830/
- Rao G, Gao H, Wang X, Zhang J, Ye M, Rao L. *MRI measurements of brain hippocampus volume in relation to mild cognitive impairment and Alzheimer disease: A systematic review and meta-analysis*. Medicine (Baltimore). 2023;102(36):e34997. DOI: 10.1097/MD.0000000000034997. PMID: 37682140. PMCID: PMC10489245. https://pmc.ncbi.nlm.nih.gov/articles/PMC10489245/
