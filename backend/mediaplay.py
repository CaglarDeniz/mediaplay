# html parsing imports 
import re 
from random import randint

# quality of life imports
import getopt
from sys import argv
from sys import exit
import subprocess
from tqdm import tqdm
import string

# debugging imports
# import pprint
# import pdb 

#selenium imports 
from selenium import webdriver
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By

class MediaPlay() : 

    def __init__(self,playlistLink=None,cookieFile='cookies.txt',verbose=False) : 

        self.playlistLink = playlistLink
        self.cookieFile = cookieFile
        self.verbose = verbose
        
        service = FirefoxService(executable_path=GeckoDriverManager().install())
        options = FirefoxOptions()
        options.add_argument('--headless')
        self.driver = webdriver.Firefox(service=service,options=options)
        
        return

    def parse_cookies_from_file(self,cookieFile="../cookies.txt"):
        '''Parse a cookies.txt file and return a dictionary of key value pairs
        compatible with requests. 
        https://stackoverflow.com/questions/14742899/using-cookies-txt-file-with-python-requests 
        using a modified version of the cookie parser function in this stack overlow post
        '''
        cookies = {}
        with open (cookieFile, 'r') as fp:
            for line in fp:
                if re.match(r'^.*illinois\.edu', line) : # if its an Illinois cookie
                    lineFields = line.strip().split('\t')
                    cookies[lineFields[5]] = lineFields[6]
        return cookies
    def parse_cookies_from_string(self,cookie_string):
        '''Parse a cookies.txt file and return a dictionary of key value pairs
        compatible with requests. 
        https://stackoverflow.com/questions/14742899/using-cookies-txt-file-with-python-requests 
        using a modified version of the cookie parser function in this stack overlow post
        '''
        cookie_string = cookie_string.splitlines()
        cookies = {}
        for line in cookie_string:
            if re.match(r'^.*illinois\.edu', line) : # if its an Illinois cookie
                lineFields = line.strip().split('\t')
                cookies[lineFields[5]] = lineFields[6]
        return cookies


    def get_vid_links(self) :
        ''' This function parses the mediaspace playlist html page
            to get the appropriate video page links, and the video creator name and date '''

        print("*navigating to playlist")
        self.driver.get(self.playlistLink)
        gallery = self.driver.find_element(By.ID,'gallery')

        link_list = {}

        galleryItems = gallery.find_elements(By.TAG_NAME,"li")

        for galleryItem in galleryItems : 
            print("*fetching video link")
            link = galleryItem.find_element(By.CLASS_NAME,'item_link').get_attribute('href')

            print("*fetching creator name")
            nameSpan = galleryItem.find_element(By.CLASS_NAME,'userLink')
            name = nameSpan.find_element(By.TAG_NAME,'span').text
            
            print("*fetching creation date")
            dateSpan = galleryItem.find_element(By.CLASS_NAME,'thumbTimeAdded')
            date = dateSpan.find_element(By.TAG_NAME,'span').text

            if link not in link_list : 
                link_list[link] = [name,date]
            else : 
                continue

        return link_list

    def get_m3u8_link(self,link) :
        ''' This function loads the mediaspace video entry in a browser, using selenium
            to parse out the m3u8 link for further use'''

        self.driver.get(link)

        iframe = WebDriverWait(self.driver,200).until(lambda d : d.find_element(By.ID,"kplayer_ifp"))

        self.driver.switch_to.frame(iframe)

        vid_element = WebDriverWait(self.driver,200).until(lambda d : d.find_element(By.ID,"pid_kplayer"))

        print("*successfully fetched m3u8 link")

        return vid_element.get_attribute("src")

    def add_cookies(self,cookie_dict:dict) : 
        '''This function adds cookies to the underlying Selenium driver
            from the passed in cookies dict, in the form of name : value 
        '''

        self.driver.get("https://mediaspace.illinois.edu")

        for key,value in cookie_dict.items() : 
            self.driver.add_cookie({'name':key,'value':value})
            
        return

    def get_m3u8_list(self,writeToFile=True,fileName="m3u8_links.txt") : 
        '''This function will move through a list of links to mediaspace videos, fetching the source m3u8 link to be downloaded later use ffmpeg
            In using this function, it is assumed that you've already added the cookies to the browser driver
        '''

        self.driver.get("https://mediaspace.illinois.edu")
        
        link_list = self.get_vid_links()
        m3u8_list = {}
        
        for link,value in link_list.items(): 
            mm3u8_link = self.get_m3u8_link(link=link)
            m3u8_list[mm3u8_link] = value

        # self.driver.quit()

        if writeToFile : 

            fil = open(fileName,'w')

            for link in m3u8_list : 
                fil.write(link+"\n")
            fil.close()

        return m3u8_list

    def download_playlist(self,playlistFolderName): 
        '''Function to download the playlist pointed to by the playlistLink variable, note that the appropriate cookies
        should already be added to the driver before calling this function'''

        if playlistFolderName == "" or playlistFolderName == None : 
            playlistFolderName = "demo" + str(randint(1,100))
        
        if self.playlistLink == None : 
            raise ValueError('The playlistLink field must be initialized before calling download playlist')

        # create folder for playlist
        print(f"*Creating a folder for the playlist under the name {playlistFolderName}")

        subprocess.run(f"mkdir {playlistFolderName}",shell=True)
            
        m3u8_list = self.get_m3u8_list() 
        for link, value in tqdm(m3u8_list.items()) : 

            # for debugging purposes
            # pdb.set_trace()
            # link = argv[1] 
            # value = [argv[2],argv[3]]

            # get rid of spaces and / in creator name and date
            value = [s.translate({ord('/'):ord('_'),ord(' '): ord('_') }) for s in value]
            print(f"*downloading video under the name {value[0]}_{value[1]}")
            subprocess.run(f'cd {playlistFolderName} && ffmpeg -loglevel error -i "{link}" -c copy -crf 40 {value[0]}_{value[1]}.mp4',shell=True)

    def download_video(self,videoLink,videoName) : 
        '''Function to download a single mediaspace video, pointed to by the videoLink argument under videoName
            notice that the required cookies should already be added to the driver before calling this function'''

        m3u8_link = self.get_m3u8_link(videoLink) 

        if '/' in videoName or ' ' in videoName : 
            raise ValueError('Video name cannot contain spaces or forward slashes')

        print(f"*downloading video under the name {videoName} ")
        subprocess.run(f'ffmpeg -loglevel info -i "{m3u8_link}" -c copy -crf 40 {videoName}.mp4',shell=True)

        return
        

def main(argv) : 

    if len(argv) == 1 : 
        print("Use the -h flag for usage format")
        exit(2)

    playlistLink = ''
    cookieFile = ''

    try : 
        opts,args = getopt.getopt(argv[1:],"hp:c:")

    except getopt.GetoptError: 
        print ('./mediaplay.py -p playlistLink -c cookieFile' )
        exit(2)

    for opt,arg in opts :

        if opt == '-h' :
            print ('./mediaplay.py -p <playlistLink> -c <cookieFile>')
            print ("Default cookie file name is cookie.txt in local directory, a playlist link must be provided")
            exit()
        elif opt == '-p': 
            playlistLink = arg 
        elif opt == '-c': 
            cookieFile = arg

    if playlistLink == '' or playlistLink == '-c' : 
        print("A playlist link must be provided with the -p argument")
        exit()

    elif cookieFile == '' or cookieFile == '-p':
        print("*using default cookie file name: cookies.txt")
        med = MediaPlay(playlistLink=playlistLink)
        med.download_playlist(playlistFolderName="")

    else : 
        med = MediaPlay(playlistLink=playlistLink,cookieFile=cookieFile)
        med.download_playlist(playlistFolderName="")
    
if __name__ == '__main__' : 
    main(argv)

            
