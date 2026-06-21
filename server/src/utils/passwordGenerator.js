const words = [
  'nebula', 'Quasar', 'Asteroid', 'comet', 'meteor', 'Galaxy', 'supernova', 'Eclipse', 'orbit', 'gravity',
  'satellite', 'telescope', 'cosmos', 'universe', 'Planet', 'exoplanet', 'Constellation', 'Wormhole', 'Aura', 'Troll',
  'aardvark', 'albatross', 'alligator', 'alpaca', 'anteater', 'Antelope', 'armadillo', 'badger', 'barracuda', 'bat',
  'bear', 'Beaver', 'bee', 'bison', 'boar', 'Buffalo', 'butterfly', 'camel', 'Caribou', 'cassowary',
  'Caterpillar', 'Cheetah', 'Chimera', 'chinchilla', 'chipmunk', 'Cobra', 'Cockatoo', 'Cougar', 'Cow', 'coyote',
  'crab', 'crane', 'crocodile', 'Crow', 'cuckoo', 'Deer', 'dingo', 'dolphin', 'donkey', 'dove',
  'dragonfly', 'Eagle', 'Echidna', 'eel', 'Elephant', 'elk', 'Emu', 'Falcon', 'ferret', 'Finch',
  'Flamingo', 'Flea', 'Fox', 'frog', 'Gazelle', 'Gecko', 'gerbil', 'Gibbon', 'Giraffe', 'gnat',
  'Gnu', 'goat', 'goose', 'gopher', 'Gorilla', 'Grasshopper', 'Grizzly', 'groundhog', 'gull', 'Hamster',
  'hare', 'Hawk', 'Hedgehog', 'Heron', 'hippopotamus', 'Hornet', 'horse', 'hound', 'hummingbird', 'hyena',
  'Iguana', 'impala', 'jackal', 'Jaguar', 'jellyfish', 'Kangaroo', 'Koala', 'kookaburra', 'lemur', 'leopard',
  'Liger', 'lion', 'llama', 'Lobster', 'locust', 'loris', 'Lynx', 'Macaw', 'magpie', 'Manatee',
  'apple', 'apricot', 'Artichoke', 'asparagus', 'avocado', 'bacon', 'Baguette', 'banana', 'basil', 'bean',
  'beef', 'beer', 'Beet', 'biscuit', 'Blackberry', 'blueberry', 'bread', 'broccoli', 'brownie', 'burger',
  'Burrito', 'butter', 'Cabbage', 'Cake', 'Candy', 'cantaloupe', 'carrot', 'Cashew', 'Cauliflower', 'Caviar',
  'celery', 'Cereal', 'Cheese', 'cherry', 'chicken', 'Chili', 'Chocolate', 'cinnamon', 'Coconut', 'coffee',
  'Cookie', 'corn', 'corndog', 'cranberry', 'croissant', 'cucumber', 'Cupcake', 'Curry', 'Custard', 'Date',
  'donut', 'Dumpling', 'eclair', 'Egg', 'Eggplant', 'Espresso', 'falafel', 'fig', 'Fish', 'flapjack',
  'flour', 'Garlic', 'gelato', 'ginger', 'gnocchi', 'grape', 'grapefruit', 'Gravy', 'guacamole', 'ham',
  'Hamburger', 'honey', 'hotdog', 'hummus', 'icecream', 'jam', 'Jalapeno', 'juice', 'kale', 'Ketchup',
  'kiwi', 'lasagna', 'leek', 'lemon', 'Lentil', 'lettuce', 'Lime', 'macaroni', 'Mango', 'maple',
  'Marshmallow', 'Mayonnaise', 'Meatball', 'Melon', 'milk', 'muffin', 'mushroom', 'mustard', 'nacho', 'Noodle',
  'Algorithm', 'android', 'Antivirus', 'application', 'Archive', 'artificial', 'automation', 'backup', 'bandwidth', 'binary',
  'bioinformatics', 'bitcoin', 'blog', 'bluetooth', 'broadband', 'Browser', 'byte', 'cache', 'Chatbot', 'chip',
  'cloud', 'Code', 'Coding', 'computer', 'computing', 'cpu', 'crypto', 'cybersecurity', 'database', 'Debug',
  'device', 'Digital', 'domain', 'download', 'ecommerce', 'Email', 'emoji', 'encryption', 'ethernet', 'file',
  'firewall', 'Firmware', 'flashdrive', 'Folder', 'forum', 'gadget', 'Gigabyte', 'Hacker', 'hardware', 'hologram',
  'html', 'hyperlink', 'Inbox', 'Internet', 'ip', 'Java', 'Javascript', 'keyboard', 'Laptop', 'link',
  'Login', 'Malware', 'memory', 'Metadata', 'Modem', 'Monitor', 'Network', 'node', 'Online', 'password',
  'phishing', 'pixel', 'platform', 'Podcast', 'processor', 'programmer', 'Programming', 'protocol', 'ram', 'reboot',
  'Robot', 'router', 'Saas', 'scanner', 'Screen', 'Script', 'search', 'Security', 'server', 'Software',
  'spam', 'Spreadsheet', 'Streaming', 'tablet', 'tech', 'Telecommunication', 'terminal', 'wizard', 'dragon', 'phoenix',
  'Griffin', 'Elf', 'dwarf', 'goblin', 'Orc', 'centaur', 'Mermaid', 'spell', 'Potion', 'wand',
  'staff', 'Castle', 'Dungeon', 'Amulet', 'Talisman', 'scroll', 'rune', 'artifact', 'Portal', 'Prophecy',
  'curse', 'Enchantment', 'Sorcerer', 'mage', 'witch', 'necromancer', 'paladin', 'Knight', 'rogue', 'Ranger',
  'cleric', 'bard', 'druid', 'Valhalla', 'Atlantis', 'camelot', 'Excalibur', 'Kraken', 'leviathan', 'hydra',
  'Gargoyle', 'basilisk', 'wyvern', 'Pegasus', 'unicorn', 'pixie', 'sprite', 'fairy', 'gnome', 'Banshee',
  'vampire', 'werewolf', 'wraith', 'ghost', 'specter', 'Phantom', 'zombie', 'Ghouls', 'Demon', 'angel',
  'Deity', 'titan', 'olympus', 'asgard', 'Midgard', 'Underworld', 'Elysium', 'chronos', 'solstice', 'Equinox',
  'Zodiac', 'alchemy', 'elixir', 'homunculus', 'golem', 'Faun', 'satyr', 'siren', 'valkyrie', 'scylla',
  'Charybdis', 'minotaur', 'Sphinx', 'cerberus', 'Anubis', 'osiris', 'Ra', 'thor', 'odin', 'Loki',
  'Zeus', 'poseidon', 'hades', 'ares', 'athena', 'apollo', 'artemis', 'hermes', 'Sofa', 'chair',
  'Table', 'desk', 'bed', 'mattress', 'pillow', 'blanket', 'Sheet', 'curtain', 'blinds', 'rug',
  'carpet', 'Lamp', 'Chandelier', 'clock', 'mirror', 'painting', 'Poster', 'vase', 'plant', 'Pot',
  'shelf', 'bookcase', 'cabinet', 'Drawer', 'Wardrobe', 'closet', 'Hanger', 'hook', 'Door', 'window',
  'Key', 'Lock', 'handle', 'switch', 'outlet', 'plug', 'cord', 'Wire', 'battery', 'charger',
  'remote', 'television', 'speaker', 'radio', 'Headphones', 'Microphone', 'camera', 'projector', 'Phone', 'Telephone',
  'Intercom', 'Thermostat', 'heater', 'fan', 'Airconditioner', 'Humidifier', 'dehumidifier', 'Purifier', 'vacuum', 'Broom',
  'dustpan', 'mop', 'Bucket', 'Sponge', 'Cloth', 'Rag', 'towel', 'Soap', 'shampoo', 'Conditioner',
  'lotion', 'Cream', 'Toothbrush', 'toothpaste', 'floss', 'Mouthwash', 'Razor', 'Shaver', 'Comb', 'brush',
  'dryer', 'iron', 'Board', 'hamper', 'washer', 'refrigerator', 'freezer', 'Oven', 'Stove', 'microwave',
  'toaster', 'Blender', 'Mixer', 'juicer', 'maker', 'Kettle', 'Cooker', 'Grill', 'Pan', 'lid',
  'Skillet', 'Wok', 'Tray', 'rack', 'bowl', 'plate', 'dish', 'Saucer', 'Cup', 'mug',
  'glass', 'Tumbler', 'pitcher', 'bottle', 'flask', 'thermos', 'jar', 'can', 'Opener', 'Corkscrew',
  'knife', 'fork', 'Spoon', 'chopsticks', 'Spatula', 'Ladle', 'Tongs', 'Whisk', 'peeler', 'grater',
  'Colander', 'strainer', 'sifter', 'scale', 'Timer', 'thermometer', 'glove', 'mitt', 'apron', 'Mat',
  'napkin', 'Ring', 'Runner', 'basin', 'sink', 'faucet', 'drain', 'disposal', 'trash', 'Bin',
  'Bag', 'tie', 'wrap', 'foil', 'paper', 'Tissue', 'Wipe', 'Diaper', 'Pad', 'Tampon',
  'cotton', 'Swab', 'ball', 'bandage', 'tape', 'glue', 'paste', 'scissors', 'blade', 'sharpener',
  'pencil', 'Pen', 'Marker', 'Crayon', 'Chalk', 'eraser', 'Ruler', 'Compass', 'Protractor', 'Calculator',
  'notebook', 'Binder', 'Clip', 'Pin', 'tack', 'Stapler', 'staples', 'punch', 'cutter', 'Trimmer',
  'envelope', 'stamp', 'card', 'letter', 'Package', 'Box', 'Dispenser', 'string', 'twine', 'rope',
  'chain', 'cable', 'strap', 'buckle', 'button', 'zipper', 'snap', 'eye', 'velcro', 'thread',
  'Yarn', 'needle', 'cushion', 'thimble', 'shears', 'measure', 'pattern', 'fabric', 'Patch', 'Kit',
  'Hammer', 'screwdriver', 'wrench', 'Pliers', 'saw', 'drill', 'bit', 'Nail', 'Screw', 'bolt',
  'nut', 'anchor', 'hinge', 'Latch', 'padlock', 'epoxy', 'Sealant', 'caulk', 'gun', 'paint',
  'Roller', 'thinner', 'solvent', 'Cleaner', 'degreaser', 'lubricant', 'oil', 'grease', 'wax', 'polish',
  'Sandpaper', 'Rasp', 'Chisel', 'Plane', 'square', 'Level', 'Plumb', 'Bob', 'Line', 'reel',
  'rule', 'Caliper', 'micrometer', 'Gauge', 'Indicator', 'Tester', 'Meter', 'Scope', 'analyzer', 'detector',
  'Sensor', 'Alarm', 'bell', 'buzzer', 'horn', 'whistle', 'light', 'bulb', 'tube', 'Fixture',
  'socket', 'Breaker', 'fuse', 'panel', 'conduit', 'Fitting', 'cover', 'strip', 'protector', 'Suppressor',
  'regulator', 'stabilizer', 'inverter', 'converter', 'transformer', 'adapter', 'Station', 'Dock', 'Stand', 'Mount',
  'bracket', 'Arm', 'holder', 'clamp', 'vice', 'grip', 'spanner', 'Ratchet', 'extension', 'adapter',
  'reducer', 'Driver', 'set', 'case', 'chest', 'cart', 'Trolley', 'dolly', 'truck', 'jack', 'stand',
  'lift', 'Hoist', 'crane', 'winch', 'puller', 'press', 'bender', 'Shear', 'nibbler', 'grinder',
  'sander', 'Polisher', 'buffer', 'router', 'shaper', 'planer', 'Joiner', 'Lathe', 'mill', 'drill',
  'press', 'borer', 'tapper', 'threader', 'screwer', 'nutrunner', 'riveter', 'tacker', 'nailer', 'pinners',
  'gluer', 'Melter', 'torch', 'iron', 'gun', 'station', 'pot', 'bath', 'Furnace', 'kiln',
  'element', 'burner', 'jet', 'nozzle', 'tip', 'hose', 'Manifold', 'valve', 'cock', 'tap',
  'spigot', 'Pump', 'compressor', 'Motor', 'Engine', 'turbine', 'Generator', 'alternator', 'Dynamo', 'cell',
  'Pack', 'bank', 'maintainer', 'controller', 'governor', 'Limiter', 'Relay', 'contactor', 'Starter', 'solenoide',
  'Actuator', 'cylinder', 'Brake', 'clutch', 'Coupling', 'joint', 'Shaft', 'axle', 'Spindle', 'Hub',
  'Bearing', 'Bushing', 'seal', 'Gasket', 'oring', 'packing', 'shim', 'spacer', 'collar', 'Sleeve',
  'Flange', 'Union', 'elbow', 'tee', 'Cross', 'Nipple', 'cap', 'Stud', 'Cotter', 'Retainer',
  'band', 'loop', 'shackle', 'Swivel', 'Sling', 'Harness', 'Belt', 'Pulley', 'sheave', 'Block',
  'Tackle', 'capstan', 'windlass', 'Mooring', 'buoy', 'fender', 'hawsers', 'net', 'Mesh', 'filter',
  'separator', 'clarifier', 'Scrubber', 'collector', 'Precipitator', 'Baghouse', 'cyclone', 'venturi', 'Condenser', 'Evaporator',
  'boiler', 'exchanger', 'cooler', 'chiller', 'Radiator', 'Convector', 'Dehydrator', 'incinerator', 'flare', 'Stack',
  'chimney', 'Flue', 'duct', 'pipe', 'channel', 'Trough', 'Hopper', 'Silo', 'Tank', 'vessel',
  'receiver', 'Accumulator', 'drum', 'barrel', 'Keg', 'pail', 'tub', 'vial', 'ampoule', 'Beaker',
  'burette', 'pipette', 'Cuvette', 'slide', 'Cover', 'slip', 'Funnel', 'Crucible', 'boat', 'Capsule',
  'Cartridge', 'Column', 'module', 'Pocket', 'sock', 'disc', 'Roll', 'ribbon', 'rod', 'Bar',
  'Profile', 'shape', 'film', 'membrane', 'laminate', 'brick', 'tile', 'Slab', 'stone', 'rock',
  'sand', 'gravel', 'soil', 'clay', 'Silt', 'Dust', 'Powder', 'granule', 'Pellet', 'flake',
  'shaving', 'sawdust', 'Fiber', 'Strand', 'Conductor', 'insulator', 'shield', 'sheath', 'armor', 'Jacket',
  'coating', 'lining', 'Plating', 'finish', 'varnish', 'lacquer', 'enamel', 'glaze', 'stain', 'dye',
  'pigment', 'resin', 'adhesive', 'sealant', 'coagulant', 'flocculant', 'dispersant', 'surfactant', 'emulsifier', 'stabilizer'
];

function generatePassword()
{
    const shuffled =
        [...words]
            .sort(
                () =>
                    Math.random()
                    - 0.5
            );

    const selected =
        shuffled.slice(
            0,
            3
        );

    const suffix =
        Math.floor(
            Math.random()
            * 90
        ) + 10;

    return `${selected[0]}-${selected[1]}-${selected[2]}-${suffix}`;
}

module.exports = {
    generatePassword
};