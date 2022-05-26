from mediaplay import MediaPlay
import pdb

pdb.set_trace()
med = MediaPlay()
cookie_dict = med.parse_cookies_from_file(cookieFile="../cookies.txt")
med.add_cookies(cookie_dict=cookie_dict)
med.download_video(videoLink="https://mediaspace.illinois.edu/media/t/1_9cgs8jtvjk",videoName="374discussion0403")
