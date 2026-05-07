> **핵심 요약**
> 여러 cohort에서 들어온 T1w MRI를 연구에 바로 넣기 위해서는 방향, 해상도, 크기, intensity scale, brain mask, segmentation, ROI, QC 기준을 하나의 **입력 계약(input contract)** 으로 맞춰야 한다. 이 문서는 `KDRC_24006526 / ses-1` 예시 이미지를 따라 raw-like T1w MRI가 최종 model-ready tensor가 되는 과정을 설명한다.

![전체 전처리 단계 montage](/images/articles/mri-gallery-20260507/00_stage_montage.jpg)

## 이 글을 읽는 방법

- **목적**: 모델 학습용 3D tensor를 만들기 전에 어떤 품질 문제가 생길 수 있는지 단계별로 확인한다.
- **이미지 기준**: 모든 이미지는 `/images/articles/mri-gallery-20260507/` 아래의 JPG 파일을 사용한다.
- **주의**: 아래 이미지는 한 subject의 QC 예시다. cohort 전체 품질을 보장하려면 ready manifest, 실패 사유, ROI voxel count distribution, site/scanner별 QC를 따로 봐야 한다.

## 전체 흐름 한눈에 보기

1. Native T1w input validation
2. Canonical RAS orientation 정렬
3. N4 bias correction 또는 동등한 intensity correction
4. HD-BET brain extraction
5. FastSurfer segmentation
6. Dementia-relevant ROI mask generation
7. 1 mm isotropic resampling
8. `[192, 224, 192]` crop/pad
9. Foreground intensity normalization
10. Final QC + ready manifest

실제 batch 운영에서는 HD-BET와 FastSurfer처럼 무거운 외부 stage를 먼저 실행하고, 후처리 script가 FastSurfer QC, ROI 생성, 1 mm RAS 변환, crop/pad, z-score normalization, final QC를 묶어 처리한다.

---

# 1. Native T1w input: 원본이 처리 가능한지 확인

![Native T1w input](/images/articles/mri-gallery-20260507/01_native_input.jpg)

## 무엇을 확인하나?

여러 cohort의 T1w MRI는 acquisition protocol, orientation, voxel size, shape, intensity range가 서로 다르다. 어떤 파일은 깨져 있거나, 4D로 저장되어 있거나, affine이 비정상일 수 있다. 전처리의 첫 단계는 “이 파일을 후속 pipeline에 넣어도 되는가?”를 판단하는 것이다.

## QC 체크리스트

- NIfTI load 가능 여부
- 3D structural volume 여부
- finite value ratio
- nonzero ratio
- voxel size sanity
- shape sanity
- affine determinant sanity
- intensity dynamic range warning

## 예시 산출물

- Raw/native-like input: `/home/vlm/data/preprocessed_minyoung4/cross_sectional/KDRC/KDRC_24006526/native_t1w.nii.gz`
- QC image: `01_native_input.jpg`

## 연구적으로 중요한 이유

입력 validation을 생략하면 후반부의 HD-BET/FastSurfer 같은 비싼 단계에서 실패가 발견된다. 더 위험한 경우는 실패가 조용히 통과되어 downstream 모델이 깨진 affine, 잘린 brain, 비정상 intensity를 질병 신호처럼 학습하는 것이다.

---

# 2. Canonical RAS: 같은 방향의 뇌로 맞추기

MRI 파일은 같은 brain이라도 저장 orientation이 다를 수 있다. 이 상태에서 crop, resampling, longitudinal difference 계산을 하면 좌우/앞뒤/상하 의미가 흔들린다.

## 산출물

- Canonicalized intermediate image 또는 이후 HD-BET/FastSurfer 입력
- affine/orientation 관련 QC log

## 연구적으로 중요한 이유

Longitudinal representation learning에서는 같은 subject의 baseline/follow-up 차이를 질병 진행 신호로 해석하려 한다. orientation handling이 흔들리면 모델은 progression이 아니라 좌표계 처리 차이를 배울 수 있다. RAS canonicalization은 longitudinal claim의 최소 조건이다.

---

# 3. N4 bias correction: scanner brightness field 줄이기

T1w MRI에는 coil sensitivity와 scanner field 때문에 같은 조직이라도 위치에 따라 밝기가 달라지는 low-frequency bias가 생길 수 있다. N4 bias correction 또는 이에 준하는 intensity correction은 skull stripping, segmentation, normalization이 더 안정적으로 작동하도록 돕는다.

## 주의점

- T1w에는 합리적인 correction 단계다.
- PET에는 같은 논리로 적용하면 안 된다. PET intensity는 tracer uptake와 정량 의미가 있으므로 T1w용 N4 처리 논리를 그대로 옮기면 위험하다.
- 실제 구현 적용 범위는 batch log와 script 기준으로 계속 검증해야 한다.

---

# 4. HD-BET brain extraction: brain foreground 정의

![HD-BET brain-only image](/images/articles/mri-gallery-20260507/02_hdbet_brain.jpg)

![HD-BET brain mask overlay](/images/articles/mri-gallery-20260507/03_hdbet_mask_overlay.jpg)

HD-BET는 skull, scalp, neck, background를 제거해서 brain-only image와 brain mask를 만든다.

## 예시 산출물

- Brain-extracted image: `/home/vlm/data/preprocessed_official/v1/KDRC/subjects/24006526/ses-1/t1w/native_t1w_hdbet.nii.gz`
- Brain mask: `/home/vlm/data/preprocessed_official/v1/KDRC/subjects/24006526/ses-1/t1w/native_t1w_hdbet_bet.nii.gz`
- QC images: `02_hdbet_brain.jpg`, `03_hdbet_mask_overlay.jpg`

## QC 체크리스트

- skull/scalp가 충분히 제거되었는가?
- frontal/temporal pole, cerebellum, cortex edge가 과도하게 잘리지 않았는가?
- brain mask가 brain 밖 tissue를 과하게 포함하지 않는가?
- 노년/위축 brain에서 ventricle 주변이나 temporal lobe가 누락되지 않았는가?

## 연구적으로 중요한 이유

Brain mask는 단순 배경 제거용 artifact가 아니다. 이후 foreground intensity normalization의 기준이고, crop/pad 중심을 잡는 기준이며, 모델이 background/FOV shortcut을 덜 배우게 하는 장치다.

---

# 5. FastSurfer segmentation: 해부학적 artifact 만들기

![FastSurfer segmentation overlay — affine corrected](/images/articles/mri-gallery-20260507/04_fastsurfer_seg_overlay_affine_corrected.jpg)

FastSurfer는 T1w brain을 anatomical labels로 분할한다. 이 단계는 예쁜 segmentation을 얻기 위한 것만이 아니라, dementia 연구에서 쓸 수 있는 ROI mask와 anatomical QC artifact를 만드는 단계다.

## 예시 산출물

- FastSurfer segmentation: `/home/vlm/data/preprocessed_official/v1/KDRC/subjects/24006526/ses-1/t1w/fastsurfer/24006526/mri/aparc.DKTatlas+aseg.deep.mgz`
- HD-BET/native grid로 재표본화된 segmentation: `aparc_DKT_on_hdbet_grid.nii.gz`
- 우선 사용 QC image: `04_fastsurfer_seg_overlay_affine_corrected.jpg`

## 중요한 alignment caveat

초기 overlay인 `04_fastsurfer_seg_overlay.jpg`는 FastSurfer conformed `256^3` space와 HD-BET/native NIfTI grid를 voxel index로 직접 겹치면서 alignment가 틀려 보일 수 있었다. 따라서 segmentation/ROI 해석에는 corrected image를 우선 사용해야 한다.

- `04_fastsurfer_seg_overlay_affine_corrected.jpg`
- `05_roi_hippocampus_overlay_affine_corrected.jpg`
- `04b_fastsurfer_seg_overlay_fs_orig_space.jpg`

이 caveat는 중요하다. segmentation 자체가 틀린 것이 아니라 overlay 좌표계가 틀린 것일 수 있기 때문이다. 반대로 corrected overlay에서도 어긋나면 segmentation 또는 resampling 문제를 의심해야 한다.

## QC 체크리스트

- segmentation이 brain anatomy에 맞게 위치하는가?
- cortical/subcortical labels가 brain 밖으로 벗어나지 않는가?
- 좌우 구조가 비정상적으로 뒤바뀌거나 찌그러지지 않았는가?
- cohort별 systematic failure가 있는가?

---

# 6. ROI mask generation: dementia-relevant 구조 분리

![Hippocampus ROI overlay — affine corrected](/images/articles/mri-gallery-20260507/05_roi_hippocampus_overlay_affine_corrected.jpg)

FastSurfer label에서 hippocampus, amygdala, entorhinal cortex, parahippocampal cortex, ventricles, posterior cingulate, precuneus 같은 dementia-relevant 구조를 mask로 추출한다.

## 예시 산출물

- Hippocampus ROI: `/home/vlm/data/preprocessed_official/v1/KDRC/subjects/24006526/ses-1/t1w/roi_masks/hippocampus.nii.gz`
- Gallery-local corrected hippocampus mask: `hippocampus_on_hdbet_grid.nii.gz`
- QC image: `05_roi_hippocampus_overlay_affine_corrected.jpg`

## 이 단계가 가능하게 하는 분석

- ROI-wise representation pooling
- medial temporal lobe 중심 ablation
- PET uptake 또는 centiloid와 regional alignment
- hippocampus/entorhinal/ventricle 중심 disease progression probe
- 모델 attention/occlusion 결과가 실제 해부학적 구조와 맞는지 검증

단, ROI mask 하나가 곧 disease evidence는 아니다. ROI는 측정 범위를 정의하는 도구이며, disease claim은 subject-level split, cohort control, age/sex/ICV adjustment, PET/clinical endpoint와 함께 검증되어야 한다.

---

# 7. Resample to 1 mm: voxel spacing 통일

Cohort마다 voxel size가 다르면 같은 해부학적 거리도 voxel 수로는 다르게 표현된다. 3D CNN/ViT/JEPA encoder는 실제 brain scale이 아니라 acquisition resolution 차이를 배울 수 있다. 그래서 최종 image와 mask를 1 mm 기준으로 맞춘다.

## 구현 원칙

- Image: linear interpolation
- Label/mask: nearest-neighbor interpolation

Label mask를 linear interpolation하면 anatomical label 값이 섞여 class 의미가 깨진다. 이 차이는 ROI volume과 boundary QC에 직접 영향을 준다.

---

# 8. Crop/pad to `[192, 224, 192]`: 모델 입력 크기 고정

Deep learning 모델은 보통 fixed shape tensor를 요구한다. 원본 MRI shape는 cohort마다 다르므로, brain mask 기준으로 crop/pad하여 `[192, 224, 192]` 형태를 만든다.

## 산출물

- Fixed-shape image tensor
- Fixed-shape brain mask
- brain voxel loss ratio 또는 crop/pad QC metric

## 핵심 포인트

이 단계의 핵심은 shape 통일 자체가 아니라 **brain loss를 감시하면서 shape를 통일하는 것**이다. 단순 center crop은 일부 cohort에서 brain edge를 자를 수 있고, 그 잘림이 dataset/domain shortcut이 될 수 있다.

---

# 9. Foreground intensity normalization: scanner brightness shortcut 줄이기

![Final tensor and brain mask overlay](/images/articles/mri-gallery-20260507/06_final_tensor_mask_overlay.jpg)

최종 tensor는 brain foreground voxel을 기준으로 robust clipping 후 z-score normalization된다. background zero가 normalization 통계에 들어가지 않도록 brain mask 내부를 기준으로 mean/std를 계산한다.

## 예시 산출물

- Final model input: `/home/vlm/data/preprocessed_official/v1/KDRC/subjects/24006526/ses-1/t1w/final_tensor/t1w_brain_1mm_RAS_192x224x192_zscore.nii.gz`
- Final brain mask: `/home/vlm/data/preprocessed_official/v1/KDRC/subjects/24006526/ses-1/t1w/final_tensor/brain_mask_1mm_RAS_192x224x192.nii.gz`
- QC image: `06_final_tensor_mask_overlay.jpg`

## 연구적으로 중요한 이유

Intensity normalization은 scanner/protocol brightness 차이를 줄이지만, cohort effect를 완전히 제거하지는 않는다. Downstream에서는 dataset-only, age/sex-only, QC-only shortcut baseline이 여전히 필요하다.

---

# 10. Final QC + ready manifest: 학습 가능한 row만 넘기기

전처리 파일이 존재한다고 곧바로 학습에 써서는 안 된다. 최종적으로 다음 조건을 확인하고 ready manifest에 기록해야 한다.

## Final QC checklist

- HD-BET output exists
- FastSurfer QC PASS 또는 허용 가능한 WARN
- ROI mask generation PASS
- final tensor exists
- final mask exists
- finite ratio 정상
- mask ratio 정상
- brain voxel loss ratio 허용 범위
- path validity 확인
- subject/session/scan 단위가 명확히 기록됨

## 결론

이 파이프라인의 진짜 가치는 raw T1w MRI를 보기 좋은 이미지로 만드는 데 있지 않다. 여러 cohort의 MRI를 같은 input contract로 통일하고, raw data를 보존하면서, QC와 manifest를 통해 실패를 추적하고, dementia 연구에 필요한 anatomical ROI까지 남기는 데 있다.

JEPA/SSL, PET amyloid transfer, longitudinal progression modeling은 이 기반 위에서만 설득력 있게 주장될 수 있다.

## 관련 글

- 알츠하이머 MRI ROI mask 시각 가이드

## 참고한 내부 evidence

- Source gallery: `/home/vlm/data/preprocessed_official/v1/_reports/preprocessing_stage_gallery_20260507`
- 직접 확인한 이미지: `00_stage_montage.jpg`, `01_native_input.jpg`, `02_hdbet_brain.jpg`, `03_hdbet_mask_overlay.jpg`, `04_fastsurfer_seg_overlay_affine_corrected.jpg`, `05_roi_hippocampus_overlay_affine_corrected.jpg`, `06_final_tensor_mask_overlay.jpg`
- Alignment caveat source: `overlay_alignment_diagnosis.json`
