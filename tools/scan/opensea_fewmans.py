import asyncio
import os
from dataclasses import asdict

import aiofiles
import aiohttp
import json

# 4153, 5810, 9310, 471 = no image

from aiostream import stream

from fewman_svg_parser import FewmanSVG

N = 9999
CONTRACT = '0xad5f6cdda157694439ef9f6dd409424321c74628'
ALL = range(0, N + 1)

URL = "https://api.opensea.io/api/v1/assets"


async def get_fewman(session, ident):
    params = {
        "token_ids": ident,
        "asset_contract_address": CONTRACT,
        "order_direction": "desc",
        "offset": "0",
        "limit": "50"
    }
    async with session.get(URL, params=params) as resp:
        data = await resp.json()
        # print(data)
        return data['assets'][0]
        # tokens = data['assets']


async def get_fewmans(session, start, end):
    params = {"token_ids": list(range(start, end + 1)),
              "asset_contract_address": CONTRACT,
              "order_direction": "desc",
              "offset": "0",
              "limit": "50"}
    results = {}
    print(f'Get fewmans from {start} to {end}.')
    async with session.get(URL, params=params) as resp:
        data = await resp.json()
        tokens = data['assets']
        for j in tokens:
            token_id = j.get('token_id')
            # num_sales = j.get('num_sales')
            # image = j.get('image_url')
            results[token_id] = j
        print(f'{len(tokens) = }')
    return results


def get_fewman_path(token_id):
    return os.path.join('./fewmans/meta', f'token_{token_id}.json')


def save_fewman(token_id, data):
    with open(get_fewman_path(token_id), 'w') as f:
        json.dump(data, f, indent=4)


def load_fewman(token_id):
    try:
        with open(get_fewman_path(token_id), 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return None


def get_fewman_img_path(token_id):
    return os.path.join('./fewmans/img', f'image_{token_id}.svg')


async def download_image(session: aiohttp.ClientSession, token_id, forced=False):
    data = load_fewman(token_id)
    image = data.get('image_url')

    img_path = get_fewman_img_path(token_id)
    if not forced and os.path.isfile(img_path):
        print(f'{token_id = } image is cached!')
        return

    if image:
        async with session.get(image) as resp:
            if resp.status == 200:
                f = await aiofiles.open(img_path, mode='wb')
                await f.write(await resp.read())
                await f.close()
                print(f'downloaded {image} for {token_id = }.')
            else:
                print(f'error loading image for {token_id = }. {resp.status = }')
    else:
        print(f'error! {token_id =} no url for image')


async def download_all_metadata():
    async with aiohttp.ClientSession() as session:
        for start in range(0, N + 1, 30):
            # for start in range(9999, 10000, 30):
            end = min(N, start + 30)
            good = False
            while not good:
                try:
                    fewmans = await get_fewmans(session, start, end)
                    for token_id, fewman in fewmans.items():
                        save_fewman(token_id, fewman)
                    good = True
                except Exception as e:
                    print(e)
                    pass


async def download_all_images():
    async with aiohttp.ClientSession() as session:
        all_tokens = list(ALL)
        ws = stream.repeat(session)
        xs = stream.zip(ws, stream.iterate(all_tokens))
        ys = stream.starmap(xs, download_image, ordered=False, task_limit=10)
        await ys


async def load_one(token_id):
    async with aiohttp.ClientSession() as session:
        f = await get_fewman(session, token_id)
        save_fewman(0, f)
        await download_image(session, token_id, forced=True)


async def gen_stars():
    results = {}
    for token_id in ALL:
        meta = load_fewman(token_id)
        if meta is None:
            print(f'error {token_id = } not found metadata!')
            continue
        fewman = FewmanSVG.parse(get_fewman_img_path(token_id))
        print(f'{token_id = }, {fewman.total_stars = }, {fewman.max_stars = }')
        obj = asdict(fewman)
        obj['id'] = token_id
        obj['image_url'] = meta['image_url']
        obj['image_original_url'] = meta['image_original_url']
        obj['name'] = meta['name']
        obj['permalink'] = meta['permalink']

        results[token_id] = obj
        if fewman.max_stars >= 3:
            print(f'Bingo {fewman}!!')

    with open('fewmans_stars_new.json', 'w') as f:
        json.dump(results, f, indent=4)


async def gen_stars_mini():
    results = {}
    for token_id in ALL:
        meta = load_fewman(token_id)
        if meta is None:
            print(f'error {token_id = } not found metadata!')
            continue
        fewman = FewmanSVG.parse(get_fewman_img_path(token_id))
        print(f'{token_id = }, {fewman.total_stars = }, {fewman.max_stars = }')
        obj = {
            'id': token_id,
            'img': meta['image_url'],
            # 'oimg': meta['image_original_url'],
            # 'link': meta['permalink'],
            'p': list(fewman.__dict__.values())
        }

        results[token_id] = obj
        if fewman.max_stars >= 3:
            print(f'Bingo {fewman}!!')

    with open('fewmans_stars_new_mini.json', 'w') as f:
        json.dump(results, f)


async def main():
    # await download_all_metadata()
    # await download_all_images()
    # await download_image()
    await gen_stars_mini()
    # await load_one(0)
    # await load_one(9999)


if __name__ == '__main__':
    asyncio.run(main())
