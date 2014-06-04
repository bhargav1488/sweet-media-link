from flask import Flask
from flask import request
from flask import make_response
from flask import render_template,redirect,g, jsonify
import urllib2, StringIO
from urllib import quote_plus, unquote_plus
import lxml.html
import pymongo
import sweetmaker
import json


global d
app = Flask(__name__)
@app.route('/')
def sample2():
    global d
    d = {}
    d['foruri'] = request.args['foruri']
    myhandler1 = urllib2.Request(d['foruri'],headers={'User-Agent':"Mozilla/5.0 (X11; U; Linux i686) Gecko/20071127 Firefox/2.0.0.11"})
    try:
        a = urllib2.urlopen(myhandler1)
        page = a.read()
        a.close()
    except ValueError:
        return "The link is malformed!!!" 
    except urllib2.URLError:
        return ""
    
    try:
        page = unicode(page,'utf-8')  
    except UnicodeDecodeError:
        pass 
    try:
        g.root = lxml.html.parse(StringIO.StringIO(page)).getroot()
    except ValueError:
        g.root = lxml.html.parse(d['foruri']).getroot() 
    g.root.make_links_absolute(d['foruri'], resolve_base_href = True)
    for i in g.root.iterlinks():
        if i[1] == 'href' and i[0].tag != 'link':
            try:
                i[0].attrib['href'] = 'http://127.0.0.1:5000/?foruri='+quote_plus(i[0].attrib['href'])
            except KeyError:
                i[0].attrib['href'] = '{0}?foruri={1}'.format('http://127.0.0.1:5000/',quote_plus(i[0].attrib['href'].encode('utf-8')))
 
    return lxml.html.tostring(g.root)

@app.route('/publish', methods=['POST'])
def publish():
    connection = pymongo.Connection()
    db = connection['sml']
    collection = db['data']
    data = {}
    data = request.get_json(force=True)
    try:
        collection.insert(data)
        print 'inserted'
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.status_code = 200
        del(data['_id'])
        print data
        sweetmaker.sweet(data)
    except:
        response = make_response()
        response.satus_code = 500
        response.data = "Your post could not be saved. Try posting again"
   
    return ""

@app.route('/see_links')
def see_publish():
    connection = pymongo.Connection()
    db = connection['sml']
    collection = db['data']
    x = 0
    url = request.args['foruri']
    ret = {}
    for i in collection.find({'where' : url}):
        del(i['_id'])
        ret[x] = i
        x = x+1
    swts = {}
    result = ''
    if len(ret) == 0:
        ret['1'] = "Sorry! No re-treats for you."
        return jsonify(ret)
    else:
        for i in ret:
            swts[i+1] = '@'+ret[i]['who']+' says '+ret[i]['where']+' is '+ret[i]['how']['type']+' '+ret[i]['how']['url'] 
        return jsonify(swts)
        


if __name__ == "__main__":
    app.run()

