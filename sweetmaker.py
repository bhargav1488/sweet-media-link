import requests
import json
from datetime import datetime

TIMESTAMP_FORMAT = '%d-%m-%Y %H:%M:%S'

def sweet(data):
    sweet = makeSweet(data)
    print sweet
    if not sweet:
        return False
    else:
        #swt = {}
        headers = {'Content-Type': 'application/json'}
        #swt['post'] = '@'+sweet['who']+' #'+sweet['what']+' '+sweet['where']+' '+''.join(['%s: %s' % (key, value) for (key, value) in sweet['how'].items()])
        #print swt
        request = requests.post("http://posttestserver.com/post.php?dir=sml", data = json.dumps(sweet), headers= headers)        
        print request
        if request.status_code == 200:
            print "posted!!"
            return True
        else:
            print "Could not be posted!!!"
            return False

def makeSweet(sweet):
    if len(sweet['who']) and len(sweet['what']) and len(sweet['where']) and len(sweet['how']):
        sweet['created'] = datetime.utcnow().strftime(TIMESTAMP_FORMAT)
    else:
        return False

    return sweet


