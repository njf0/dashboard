from bs4 import BeautifulSoup
import urllib.request
import data
        
def soupify(url):
    page = urllib.request.urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    return soup

def get_isis_update(url):
    soup = soupify(url)
    updates = soup.prettify()
    lines = updates.splitlines()
    for i in lines:
        if lines[lines.index(i)] and lines[lines.index(i)+1] == '':
            update = lines[0:lines.index(i)+1]
            break
        continue
    last_update = "(Last updated {})".format(update[0])
    text = update[1:]
    stripped = [i.strip() for i in text]
    one_liner = ''
    for i in stripped:
        one_liner += i + ' '
    one_liner += last_update
    return one_liner

def get_synchrotron_current(url):
    soup = soupify(url).prettify().splitlines()[4].strip()
    current = soup.split()[4]
    return soup

if __name__ == "__main__":

    update = get_isis_update(data.mcr_news_url)
    print(update)
    current = get_synchrotron_current(data.beam_current_url)
    print(current)