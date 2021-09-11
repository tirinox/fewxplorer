import xml.etree.ElementTree as ET
from dataclasses import dataclass

NS_ARRAY = {
    'svg': 'http://www.w3.org/2000/svg',
    'xlink': 'http://www.w3.org/1999/xlink'
}

BLOCKS = {
    'Hair-Block',
    'Eyes-Block',
    'Body-Block',
    'Sexuality-Block',
    'Intelligence-Block',
    'Career-Block',
    'Curse-Block',
    'GodsGift-Block'
}

MALE = 'male'
FEMALE = 'female'


@dataclass
class FewmanSVG:
    gender: str = ''

    hair: str = ''
    hair_stars: int = 0

    eyes: str = ''
    eyes_stars: int = 0

    body: str = ''
    body_stars: int = 0

    sex: str = ''
    sex_stars: int = 0

    intel: str = ''
    intel_stars: int = 0

    career: str = ''
    career_stars: int = 0

    curse: str = ''
    curse_stars: int = 0

    gift: str = ''
    gift_stars: int = 0

    @staticmethod
    def get_name_and_stars(root, name):

        rarity = 0
        block = root.findall(f"svg:g/svg:g[@id='{name}-Block']", NS_ARRAY)[0]

        rarity_g = block.findall(f"./svg:g", NS_ARRAY)
        if rarity_g:
            rarity = rarity_g[0].attrib.get('id', '')
            _, d = rarity.split('-')
            rarity, *_ = d.split('_')
            text_block = rarity_g[0]
        else:
            text_block = block

        text_block = text_block.findall('./svg:text', NS_ARRAY)[-1]
        value = text_block.findall('./svg:tspan', NS_ARRAY)[0].text

        return value, int(rarity)

    @classmethod
    def parse(cls, path):
        try:
            tree = ET.parse(path)
        except FileNotFoundError:
            return cls()
        root = tree.getroot()

        gender, _ = cls.get_name_and_stars(root, 'Gender')

        hair, hair_stars = cls.get_name_and_stars(root, 'Hair')
        eyes, eyes_stars = cls.get_name_and_stars(root, 'Eyes')
        body, body_stars = cls.get_name_and_stars(root, 'Body')
        sex, sex_stars = cls.get_name_and_stars(root, 'Sexuality')
        intel, intel_stars = cls.get_name_and_stars(root, 'Intelligence')
        career, career_stars = cls.get_name_and_stars(root, 'Career')
        curse, curse_stars = cls.get_name_and_stars(root, 'Curse')
        gift, gift_stars = cls.get_name_and_stars(root, 'GodsGift')

        return cls(
            gender,
            hair, hair_stars,
            eyes, eyes_stars,
            body, body_stars,
            sex, sex_stars,
            intel, intel_stars,
            career, career_stars,
            curse, curse_stars,
            gift, gift_stars
        )

    @property
    def stars_as_list(self):
        return [self.hair_stars, self.eyes_stars, self.body_stars, self.sex_stars,
                self.intel_stars, self.career_stars, self.curse_stars, self.gift_stars]

    @property
    def total_stars(self):
        return sum(self.stars_as_list)

    @property
    def max_stars(self):
        return max(self.stars_as_list)


if __name__ == '__main__':
    for i in range(0, 16):
        f = FewmanSVG.parse(f'fewmans/img/image_{i}.svg')
        print(f)
