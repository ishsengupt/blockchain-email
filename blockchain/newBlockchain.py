from flask import Flask, request, jsonify, render_template
from time import time
from flask_cors import CORS
from collections import OrderedDict
import binascii
from Crypto.PublicKey import RSA
from Crypto.Signature import PKCS1_v1_5
from Crypto.Hash import SHA
from uuid import uuid4
import json
import hashlib
import requests
from urllib.parse import urlparse

MINE_DIFFICULTY = 2
MINING_REWARD = 1
MINING_SENDER = "The Blockchain"
MINE_MESSAGEHEADER = "Block Mined"
MINE_MESSAGECONTENT = "Block mined successfully"


class Blockchain:

    def __init__(self):
        self.chain = []
        self.pendingTransactions = []
        self.nodes = set()
        self.node_id = str(uuid4()).replace('-', '')

        self.createNewBlock(100, '0', '0')  # creates genesis block

    def register_node(self, node_url):
        parsed_url = urlparse(node_url)
        if parsed_url.netloc:
            self.nodes.add(parsed_url.netloc)
        elif parsed_url.path:
            self.nodes.add(parsed_url.path)
        else:
            raise ValueError('Invalid URL')

    @staticmethod
    def hash(block):

        block_string = json.dumps(block, sort_keys=True).encode('utf8')
        h = hashlib.new('sha256')
        h.update(block_string)
        return h.hexdigest()

    def resolve_conflicts(self):
        neighbours = self.nodes
        new_chain = None

        max_length = len(self.chain)
        for node in neighbours:
            response = requests.get('http://' + node + '/chain')
            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']

                if length > max_length and self.valid_chain(chain):
                    max_length = length
                    new_chain = chain

        if new_chain:
            self.chain = new_chain
            return True

        return False

    def createNewBlock(self, nonce, previousBlockHash, currentHash):
        # adds block to the pending Transaction

        newBlock = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'transactions': self.pendingTransactions,
            'nonce': nonce,
            'currentHash': currentHash,
            'previousBlockHash': previousBlockHash



        }

        self.pendingTransactions = []
        self.chain.append(newBlock)

        return newBlock

    def getLastBlock(self):
        return self.chain[len(self.chain)-1]

    def verify_transaction_signature(self, sender_public_key, signature, transaction):
        public_key = RSA.importKey(binascii.unhexlify(sender_public_key))
        verifier = PKCS1_v1_5.new(public_key)
        h = SHA.new(str(transaction).encode('utf8'))
        try:
            verifier.verify(h, binascii.unhexlify(signature))
            return True
        except ValueError:
            return False

    def createandValidateNewTransaction(self, sender_public_key, recipient_public_key, signature, amount, messageheader, messagecontent):

        newTransaction = OrderedDict({
            'sender_public_key': sender_public_key,
            'recipient_public_key': recipient_public_key,
            'amount': amount,
            'messageheader': messageheader,
            'messagecontent' : messagecontent
        })

        if sender_public_key == MINING_SENDER:
            self.pendingTransactions.append(newTransaction)
        
            return len(self.chain) + 1
        else:
            signature_verified = self.verify_transaction_signature(
                sender_public_key, signature, newTransaction)
            if signature_verified:

                self.pendingTransactions.append(newTransaction)
                return len(self.chain) + 1
            else:
                return False

    def getTransaction(self, transactionId):
        corrTransaction = None
        corrBlock = None

        for chainblock in self.chain:
            for blocktransactions in chainblock:
                if blocktransaction.sender_public_key == transactionId:
                    corrTransaction = blocktransaction
                    corrBlock = chainblock
        return {
            transaction: corrTransaction,
            block: corrBlock
        }

    @staticmethod
    def hashBlock(previousBlockHash, currentBlockData, nonce):
        dataasString = (str(previousBlockHash) +
                        str(currentBlockData) + str(nonce)).encode('utf8')
        
        encrypter = hashlib.new('sha256')
        encrypter.update(dataasString)
        dataHash = encrypter.hexdigest()
        return dataHash

    def proofOfWork(self, previousBlockHash, currentBlockData):
        nonce = 0
        dataHash = self.hashBlock(previousBlockHash, currentBlockData, nonce)
        while (dataHash[:MINE_DIFFICULTY] == '0' * MINE_DIFFICULTY) is False:
            print(nonce)
            nonce += 1
            dataHash = self.hashBlock(
                previousBlockHash, currentBlockData, nonce)

        return nonce

    def chainIsValid(self, blockchain):
        chainValid = True

        for i in range(len(blockchain)):
            currentBlock = blockchain[i]
            previousBlock = blockchain[i - 1]
            blockHash = self.hashBlock(previousBlock['currentHash'], {
                                       transactions: currentBlock['transactions'], index: currentBlock['index']}, currentBlock['nonce'])
            if blockHash[:MINE_DIFFICULTY] == '0' * MINE_DIFFICULTY is False:
                chainValid = False
            if (currentBlock['previousBlockHash'] != prevBlock['hash']):
                validChain = False

        genesisBlock = blockchain[0]
        corrNonce = genesisBlock['nonce'] == 100
        corrPreviousBlockHash = genesisBlock['previousBlockHash'] == '0'
        corrHash = genesisBlock['hash'] == '0'
        corrTransactions = genesisBlock['transactions'].length == 0

        if (correctNonce is False or correctPreviousBlockHash is False or correctHash is False or correctTransactions is False):
            validChain = false
            print('false')

        return validChain

blockchain = Blockchain()

# Instantiate the Node
app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return render_template('./index.html')


@app.route('/configure')
def configure():
    return render_template('./configure.html')


@app.route('/transactions/get', methods=['GET'])
def get_transactions():
    print(blockchain.pendingTransactions)
    transactions = blockchain.pendingTransactions
    response = {'transactions': transactions}
    return jsonify(response), 200


@app.route('/chain', methods=['GET'])
def get_chain():
    response = {
        'chain': blockchain.chain,
        'length': len(blockchain.chain)
    }

    return jsonify(response), 200

@app.route('/mine', methods=['GET'])
def mine():
    lastBlock = blockchain.getLastBlock()
    previousBlockHash = lastBlock['currentHash']
    currentBlockData = {
        'transactions': blockchain.pendingTransactions,
        'index': lastBlock['index'] + 1
    }

    blockchain.createandValidateNewTransaction(sender_public_key=MINING_SENDER,
                                  recipient_public_key=blockchain.node_id,
                                  signature='',
                                  amount=MINING_REWARD, messageheader=MINE_MESSAGEHEADER, messagecontent=MINE_MESSAGECONTENT )

    nonce = blockchain.proofOfWork(previousBlockHash, currentBlockData)
    blockHash = blockchain.hashBlock(previousBlockHash, currentBlockData, nonce)
    newBlock = blockchain.createNewBlock(nonce, previousBlockHash, blockHash)
    

    response = {
        'message': 'New block created',
        'index': newBlock['index'],
        'transactions': newBlock['transactions'],
        'nonce': newBlock['nonce'],
        'previous_hash': newBlock['previousBlockHash'],
    }

    print(response)
    return jsonify(response), 200



@app.route('/transactions/new', methods=['POST'])
def new_transaction():
    values = request.json['transaction']
    print(request.json)
    required = ['sender_public_key', 'recipient_public_key',
                'amount', 'messageheader', 'messagecontent']
    if not all(k in values for k in required):
        return 'Missing values', 400

    transaction_results = blockchain.createandValidateNewTransaction(values['sender_public_key'],
                                                        values['recipient_public_key'],
                                                        request.json['signature'],
                                                        values['amount'],
                                                        values['messageheader'],
                                                        values['messagecontent']
                                                        )
    if transaction_results == False:
        response = {'message': 'Invalid transaction/signature'}
        return jsonify(response), 406
    else:
        response = {'message': 'Transaction will be added to the Block ' + str(transaction_results)}
        return jsonify(response), 201 
    

@app.route('/nodes/get', methods=['GET'])
def get_nodes():
    nodes = list(blockchain.nodes)
    response = {'nodes': nodes}
    return jsonify(response), 200


@app.route('/nodes/resolve', methods=['GET'])
def consensus():
    replaced = blockchain.resolve_conflicts()

    if replaced:
        response = {
            'message': 'Our chain was replaced',
            'new_chain': blockchain.chain
        }
    else:
        response = {
            'message': 'Our chain is authoritative',
            'chain': blockchain.chain
        }
    return jsonify(response), 200


@app.route('/nodes/register', methods=['POST'])
def register_node():
    values = request.form
    # 127.0.0.1:5002,127.0.0.1:5003, 127.0.0.1:5004
    nodes = values.get('nodes').replace(' ', '').split(',')

    if nodes is None:
        return 'Error: Please supply a valid list of nodes', 400

    for node in nodes:
        blockchain.register_node(node)

    response = {
        'message': 'Nodes have been added',
        'total_nodes': [node for node in blockchain.nodes]
    }
    return jsonify(response), 200


if __name__ == '__main__':
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5001, type=int, help="port to listen to")
    args = parser.parse_args()
    port = args.port

    app.run(host='127.0.0.1', port=port, debug=True)
