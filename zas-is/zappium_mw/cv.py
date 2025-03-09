import cv2
import os
import shutil
# 촬영된 영상 경로
if __name__ == '__main__' :
    # ls = ['LG','KT','SKT']
    ls = ['LG']
    # pages = ['메인','모바일요금제','모바일서브메인','혜택','고객지원','다이렉트샵']
    pages = ['메인']
    # pages = ['메인']
    default_path = r'C:\Users\유닉솔루션(주)\Downloads\250218 APP'
    # default_path = r'C:\Users\유닉솔루션(주)\Downloads'
    n =1
    # frames = []  # 프레임 저장 리스트
    frames = {}  # 프레임 저장 리스트
    for 통신사 in ls:
        frames[통신사]={}
        for page in pages:
            # for n in range(1,6):
                print(f"회차 : {n}")
                frames[통신사][page]=[]
                video_path = os.path.join(default_path,f'{통신사}\{통신사}_{page}_{n}.mp4')
                # video_path = os.path.join(default_path,f'{통신사}_{page}.mp4')
                print(video_path)
                cap = cv2.VideoCapture(video_path)
                folder_path = f'cv2/{통신사}/{통신사}_{page}_{n}'
                if not os.path.exists(folder_path):
                    # 폴더가 존재하지 않으면 새로 생성
                    print(f"{folder_path} >> make directory")
                    os.makedirs(folder_path)
                else:
                    # 폴더가 이미 존재하면 삭제(내부 파일까지 다 삭제) 하고 새로 생성
                    shutil.rmtree(folder_path)
                    os.makedirs(folder_path)
                # FPS 가져오기
                fps = cap.get(cv2.CAP_PROP_FPS)
                # frame_interval = int(fps * 0.1)  # 0.1초 간격
                frame_interval = max(int(fps * 0.01), 1)  # 0.05초 간격
                print(f"frame_interval: {frame_interval}")
                frame_count = 0
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        break
                    # 현재 초 단위 경과 시간 계산
                    time_elapsed = frame_count / fps
                    # 0.01초 간격으로 저장
                    if frame_count % frame_interval == 0:
                        frame_filename = f"cv2/{통신사}/{통신사}_{page}_{n}/frame_{frame_count/fps:.2f}.jpg"
                        cv2.imwrite(frame_filename, frame)
                        frames[통신사][page].append((time_elapsed, frame, frame_filename))  # 타임스탬프 저장
                        print(f"Saved: {frame_filename}")
                    frame_count += 1
                cap.release()
                cv2.destroyAllWindows()
    # for 통신사 in ls:
    #     frames[통신사]={}
    #     for page in pages:
    #         frames[통신사][page]={}
    #         for n in range(1,6):
    #             frames[통신사][page][n]=[]
    #             video_path = os.path.join(default_path,f'{통신사}\{통신사}_{page}_{n}.mp4')
    #             print(video_path)
    #             cap = cv2.VideoCapture(video_path)
    #             folder_path = f'cv2/{통신사}/{통신사}_{page}_{n}'
    #             if not os.path.exists(folder_path):
    #                 # 폴더가 존재하지 않으면 새로 생성
    #                 print(f"{folder_path} >> make directory")
    #                 os.makedirs(folder_path)
    #             else:
    #                 # 폴더가 이미 존재하면 삭제(내부 파일까지 다 삭제) 하고 새로 생성
    #                 shutil.rmtree(folder_path)
    #                 os.makedirs(folder_path)
    #             # FPS 가져오기
    #             fps = cap.get(cv2.CAP_PROP_FPS)
    #             # frame_interval = int(fps * 0.1)  # 0.1초 간격
    #             frame_interval = max(int(fps * 0.05), 1)  # 0.05초 간격
    #             print(f"frame_interval: {frame_interval}")
    #             frame_count = 0
    #             while cap.isOpened():
    #                 ret, frame = cap.read()
    #                 if not ret:
    #                     break
    #                 # 현재 초 단위 경과 시간 계산
    #                 time_elapsed = frame_count / fps
    #                 # 0.01초 간격으로 저장
    #                 if frame_count % frame_interval == 0:
    #                     frame_filename = f"cv2/{통신사}/{통신사}_{page}_{n}/frame_{frame_count/fps:.2f}.jpg"
    #                     cv2.imwrite(frame_filename, frame)
    #                     frames[통신사][page][n].append((time_elapsed, frame, frame_filename))  # 타임스탬프 저장
    #                     print(f"Saved: {frame_filename}")
    #                 frame_count += 1
    #             cap.release()
    #             cv2.destroyAllWindows()
    # # 동영상 파일 읽기
    # # video_path = "test.mp4"
    # cap = cv2.VideoCapture(video_path)
    # # FPS 가져오기
    # fps = cap.get(cv2.CAP_PROP_FPS)
    # print(fps)
    # frame_interval = int(fps * 0.1)  # 0.1초 간격
    # print(frame_interval)
    # frame_count = 0
    # frames = []  # 프레임 저장 리스트
    # while cap.isOpened():
    #     ret, frame = cap.read()
    #     if not ret:
    #         break
    #     # 0.1초 간격으로 저장
    #     if frame_count % frame_interval == 0:
    #         frame_filename = f"cv2/frame_{frame_count/fps:.1f}.jpg"
    #         cv2.imwrite(frame_filename, frame)
    #         frames.append((frame_count / fps, frame, frame_filename))  # 타임스탬프와 함께 저장
    #         print(f"Saved: {frame_filename}")
    #     frame_count += 1
    # cap.release()
    def detect_spinner(frame, spinner_template):
        result = cv2.matchTemplate(frame, spinner_template, cv2.TM_CCOEFF_NORMED)
        _, max_val, _, _ = cv2.minMaxLoc(result)
        return max_val  # 템플릿 일치 정도 반환
    for 통신사,value in frames.items():
        for page, value2 in value.items():
            for time,frame,frame_filename in value2:
                path = f'cv2/{통신사}/{통신사}_{page}_로딩완료.jpg'
                # path = f'cv2/{통신사}_{page}_로딩완료.jpg'
                spinner_template = cv2.imread(path)  # 스피너 이미지
                match_score = detect_spinner(frame, spinner_template)
                print(f"{page} >> Time: {time:.2f}s, Match Score: {match_score}")
                if match_score > 0.9:  # 스피너가 더 이상 없으면 로딩 완료로 간주
                    print(f"{통신사}_{page}_{n} 페이지 총 갯수: {len(frames[통신사][page])}")
                    print(f"{통신사}_{page}_{n} 로딩 완료 시점: {time:.2f}s, 이미지: {frame_filename}")
                    break
    # for time, frame, frame_filename in frames:
    #     path = f'cv2/{통신사}/{통신사}_{page}_로딩완료.jpg'
    #     spinner_template = cv2.imread(path)  # 스피너 이미지
    #     match_score = detect_spinner(frame, spinner_template)
    #     print(f"{page} >> Time: {time:.2f}s, Match Score: {match_score}")
    #     if match_score > 0.9:  # 스피너가 더 이상 없으면 로딩 완료로 간주
    #         print(f"로딩 완료 시점: {time:.2f}s, 이미지: {frame_filename}")
    #         break
